<?php
/**
 * FakeStore API Testing Tool
 * PHP Backend for API data validation
 * 
 * @author Igor Novak - Junior+ PHP Developer at Innowise
 * @version 1.0
 */

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Main class for API testing functionality
 */
class FakeStoreApiTester 
{
    private const API_URL = 'https://fakestoreapi.com/products';
    private $testResults = [];
    private $defectiveProducts = [];
    private $startTime;
    
    public function __construct() 
    {
        $this->startTime = microtime(true);
    }
    
    /**
     * Run all API tests and return results
     * 
     * @return array Test results
     */
    public function runTests(): array 
    {
        try {
            // Test 1: API Response Code
            $apiData = $this->testApiResponse();
            
            if (!$apiData) {
                return $this->getErrorResponse('Failed to fetch API data');
            }
            
            // Test 2: Validate Product Data
            $this->validateProductData($apiData['data']);
            
            // Calculate execution time
            $executionTime = round((microtime(true) - $this->startTime) * 1000, 2);
            
            return [
                'success' => true,
                'responseCode' => $apiData['responseCode'],
                'totalProducts' => count($apiData['data']),
                'defectsCount' => count($this->defectiveProducts),
                'responseTime' => $executionTime . 'ms',
                'testResults' => $this->testResults,
                'defectiveProducts' => $this->defectiveProducts,
                'timestamp' => date('Y-m-d H:i:s')
            ];
            
        } catch (Exception $e) {
            return $this->getErrorResponse($e->getMessage());
        }
    }
    
    /**
     * Test API response code and fetch data
     * 
     * @return array|false API data and response code
     */
    private function testApiResponse() 
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => self::API_URL,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT => 'FakeStore API Tester 1.0'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            $this->addTestResult('API Response Code', false, "cURL Error: $error");
            return false;
        }
        
        // Test response code
        if ($httpCode === 200) {
            $this->addTestResult('API Response Code', true, "Expected 200, got $httpCode");
        } else {
            $this->addTestResult('API Response Code', false, "Expected 200, got $httpCode");
            return false;
        }
        
        // Test JSON parsing
        $data = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->addTestResult('JSON Parsing', false, 'Invalid JSON response');
            return false;
        }
        
        $this->addTestResult('JSON Parsing', true, 'Valid JSON response');
        
        // Test if response is array
        if (!is_array($data)) {
            $this->addTestResult('Response Format', false, 'Response is not an array');
            return false;
        }
        
        $this->addTestResult('Response Format', true, 'Response is a valid array');
        
        return [
            'data' => $data,
            'responseCode' => $httpCode
        ];
    }
    
    /**
     * Validate product data according to requirements
     * 
     * @param array $products Array of products
     */
    private function validateProductData(array $products): void 
    {
        $totalProducts = count($products);
        $validProducts = 0;
        $defectCounts = [
            'empty_title' => 0,
            'negative_price' => 0,
            'invalid_rating' => 0,
            'missing_fields' => 0
        ];
        
        foreach ($products as $product) {
            $productDefects = [];
            $hasDefects = false;
            
            // Check required fields exist
            $requiredFields = ['id', 'title', 'price', 'rating'];
            $missingFields = [];
            
            foreach ($requiredFields as $field) {
                if (!isset($product[$field])) {
                    $missingFields[] = $field;
                }
            }
            
            if (!empty($missingFields)) {
                $productDefects[] = 'Missing fields: ' . implode(', ', $missingFields);
                $defectCounts['missing_fields']++;
                $hasDefects = true;
            }
            
            // Test 1: Title validation (must not be empty)
            if (isset($product['title']) && (empty(trim($product['title'])) || trim($product['title']) === '')) {
                $productDefects[] = 'Empty title';
                $defectCounts['empty_title']++;
                $hasDefects = true;
            }
            
            // Test 2: Price validation (must not be negative)
            if (isset($product['price']) && (is_numeric($product['price']) && $product['price'] < 0)) {
                $productDefects[] = 'Negative price: ' . $product['price'];
                $defectCounts['negative_price']++;
                $hasDefects = true;
            }
            
            // Test 3: Rating validation (must not exceed 5 and must be numeric)
            if (isset($product['rating']) && isset($product['rating']['rate'])) {
                $rating = $product['rating']['rate'];
                if (!is_numeric($rating) || $rating > 5 || $rating < 0) {
                    $productDefects[] = 'Invalid rating: ' . $rating . ' (must be 0-5)';
                    $defectCounts['invalid_rating']++;
                    $hasDefects = true;
                }
            }
            
            // Add to defective products list if has defects
            if ($hasDefects) {
                $this->defectiveProducts[] = [
                    'id' => $product['id'] ?? 'Unknown',
                    'title' => isset($product['title']) ? substr($product['title'], 0, 50) . '...' : 'No title',
                    'defects' => $productDefects
                ];
            } else {
                $validProducts++;
            }
        }
        
        // Add summary test results
        $this->addTestResult(
            'Total Products Fetched', 
            true, 
            "$totalProducts products retrieved"
        );
        
        $this->addTestResult(
            'Products with Valid Titles', 
            $defectCounts['empty_title'] === 0, 
            $defectCounts['empty_title'] === 0 ? 
                'All products have valid titles' : 
                $defectCounts['empty_title'] . ' products with empty titles'
        );
        
        $this->addTestResult(
            'Products with Valid Prices', 
            $defectCounts['negative_price'] === 0, 
            $defectCounts['negative_price'] === 0 ? 
                'All products have valid prices' : 
                $defectCounts['negative_price'] . ' products with negative prices'
        );
        
        $this->addTestResult(
            'Products with Valid Ratings', 
            $defectCounts['invalid_rating'] === 0, 
            $defectCounts['invalid_rating'] === 0 ? 
                'All products have valid ratings (0-5)' : 
                $defectCounts['invalid_rating'] . ' products with invalid ratings'
        );
        
        $this->addTestResult(
            'Products with Complete Data', 
            $defectCounts['missing_fields'] === 0, 
            $defectCounts['missing_fields'] === 0 ? 
                'All products have required fields' : 
                $defectCounts['missing_fields'] . ' products missing required fields'
        );
        
        $this->addTestResult(
            'Overall Data Quality', 
            count($this->defectiveProducts) === 0, 
            count($this->defectiveProducts) === 0 ? 
                'All products passed validation' : 
                count($this->defectiveProducts) . ' products have data quality issues'
        );
    }
    
    /**
     * Add test result to results array
     * 
     * @param string $testName Name of the test
     * @param bool $passed Whether test passed
     * @param string $message Test result message
     */
    private function addTestResult(string $testName, bool $passed, string $message): void 
    {
        $this->testResults[] = [
            'name' => $testName,
            'passed' => $passed,
            'message' => $message
        ];
    }
    
    /**
     * Get error response format
     * 
     * @param string $message Error message
     * @return array Error response
     */
    private function getErrorResponse(string $message): array 
    {
        return [
            'success' => false,
            'error' => $message,
            'responseCode' => 'Error',
            'totalProducts' => 0,
            'defectsCount' => 0,
            'responseTime' => '0ms',
            'testResults' => [],
            'defectiveProducts' => [],
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}

// Main execution
try {
    $tester = new FakeStoreApiTester();
    $results = $tester->runTests();
    echo json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?> 