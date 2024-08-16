import unittest
from unittest.mock import patch, MagicMock
import json

# Mock the entire boto3 module
mock_boto3 = MagicMock()
mock_client = MagicMock()
mock_boto3.client.return_value = mock_client

# Apply the mock before importing your module
with patch.dict('sys.modules', {'boto3': mock_boto3}):
    from your_module import invoke_sm_azure_endpoint  # Replace 'your_module' with the actual module name

class TestInvokeSMAzureEndpoint(unittest.TestCase):

    def setUp(self):
        # Reset the mock before each test
        mock_boto3.reset_mock()
        mock_client.reset_mock()

    def test_invoke_sm_azure_endpoint(self):
        # Arrange
        mock_response = {
            'ResponseMetadata': {'HTTPStatusCode': 200},
            'Body': MagicMock()
        }
        mock_response['Body'].read.return_value = json.dumps({'prediction': 'test_prediction'}).encode('utf-8')
        mock_client.invoke_endpoint.return_value = mock_response

        test_payload = {'input': 'test_input'}

        # Act
        result = invoke_sm_azure_endpoint(test_payload)

        # Assert
        mock_boto3.client.assert_called_once_with('runtime.sagemaker', region_name='us-east-1')
        mock_client.invoke_endpoint.assert_called_once_with(
            EndpointName='abc',
            ContentType='application/json',
            Body=json.dumps(test_payload)
        )
        
        self.assertEqual(result, mock_response)

if __name__ == '__main__':
    unittest.main()
