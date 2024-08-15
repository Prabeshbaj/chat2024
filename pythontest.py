import unittest
import json
from moto import mock_sagemaker
import boto3
from botocore.exceptions import ClientError
from your_module import invoke_sm_azure_endpoint  # Replace 'your_module' with the actual module name

@mock_sagemaker
class TestInvokeSMAzureEndpoint(unittest.TestCase):
    def setUp(self):
        self.sagemaker_client = boto3.client('sagemaker', region_name='us-east-1')
        self.runtime_client = boto3.client('sagemaker-runtime', region_name='us-east-1')
        
        # Create a mock endpoint
        self.sagemaker_client.create_endpoint(
            EndpointName='abc-heka',
            EndpointConfigName='dummy-config'
        )

    def test_invoke_sm_azure_endpoint(self):
        # Mock input data
        input_data = {"key": "value"}
        
        # Mock the endpoint to return a specific response
        self.runtime_client.meta.events.register('before-call.sagemaker-runtime.InvokeEndpoint', 
                                                 self.mock_invoke_endpoint)

        # Call the function
        result = invoke_sm_azure_endpoint(input_data)

        # Assert that the function returns the expected output
        self.assertEqual(result, {"output": {"result": "success"}})

    def test_invoke_sm_azure_endpoint_error(self):
        # Mock input data
        input_data = {"key": "value"}
        
        # Delete the endpoint to simulate an error
        self.sagemaker_client.delete_endpoint(EndpointName='abc-heka')

        # Call the function and assert that it raises a ClientError
        with self.assertRaises(ClientError):
            invoke_sm_azure_endpoint(input_data)

    def mock_invoke_endpoint(self, params, context, **kwargs):
        # This method mocks the response from the SageMaker endpoint
        params['response'] = {
            'Body': json.dumps({"output": {"result": "success"}}).encode(),
            'ContentType': 'application/json',
        }

if __name__ == '__main__':
    unittest.main()
