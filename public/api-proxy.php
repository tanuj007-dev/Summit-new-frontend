<?php
/**
 * Same-origin API proxy to avoid CORS when frontend is on a different domain.
 * Forwards requests to api.summithomeappliance.com so the browser only talks to this origin.
 * Deploy this file to your hosting root (e.g. same folder as index.html).
 */

$API_TARGET = 'https://api.summithomeappliance.com';
$PROXY_PREFIX = '/api-proxy.php';

// Get path: /api-proxy.php/api/admin/categories?x=1 -> /api/admin/categories
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$queryString = $_SERVER['QUERY_STRING'] ?? '';
$pathOnly = strpos($requestUri, '?') !== false ? substr($requestUri, 0, strpos($requestUri, '?')) : $requestUri;
$pos = strpos($pathOnly, $PROXY_PREFIX);
if ($pos === false) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid proxy path']);
    exit;
}
$backendPath = substr($pathOnly, $pos + strlen($PROXY_PREFIX));
if ($backendPath === '' || $backendPath[0] !== '/') {
    $backendPath = '/' . ltrim($backendPath, '/');
}
$targetUrl = rtrim($API_TARGET, '/') . $backendPath;
if ($queryString !== '') {
    $targetUrl .= '?' . $queryString;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Build headers to forward
$forwardHeaders = ['Accept: application/json'];
$contentType = $_SERVER['HTTP_CONTENT_TYPE'] ?? 'application/json';
$forwardHeaders[] = 'Content-Type: ' . $contentType;
if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $forwardHeaders[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}
if (!empty($_SERVER['HTTP_COOKIE'])) {
    $forwardHeaders[] = 'Cookie: ' . $_SERVER['HTTP_COOKIE'];
}

$ch = curl_init($targetUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => $forwardHeaders,
]);

if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $body = file_get_contents('php://input');
    if ($body !== false && $body !== '') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Proxy request failed']);
    exit;
}

$responseHeaders = substr($response, 0, $headerSize);
$responseBody = substr($response, $headerSize);

// Forward status and important headers (don't forward all to avoid CORS/security issues)
http_response_code($httpCode);
$contentType = null;
foreach (explode("\r\n", $responseHeaders) as $line) {
    if (stripos($line, 'Content-Type:') === 0) {
        $contentType = trim(substr($line, 12));
        break;
    }
}
if ($contentType !== null) {
    header('Content-Type: ' . $contentType);
}
header('Cache-Control: no-store');

echo $responseBody;
