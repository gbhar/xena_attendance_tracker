class Router():

  def __init__(self):
    self._response = {}
    self._response['headers'] = {}
    self._response['headers']['content-type'] = "application/json"

  def route(self, event):
    if event['httpMethod'] == "POST":
      # check that a JSON body is passed if it is a POST request
      try:
        self._response['body'] = event['body']
        self._response['statusCode'] = 200
      except Exception as e:
        self._response['statusCode'] = 500
        self._response['body'] = {
          "code": str(self._response['statusCode']),
          "message": "ERROR: POST call made, but no body was passed. Expecting a JSON body "
        }
        print(self._response['body'])
      return self._response

    # GET /hello
    if event['path'] == '/hello':
      # error handling if not POST or insufficient payload
      try:
        self._response['statusCode'] = 200
        self._response['body'] = "Hello from the Serverless Training Backend! "
      except Exception as e:
        print(str(e))
        self._response['body'] = {
          "code": str(self._response['statusCode']),
          "message": str(e)
        }
        return self._response

    else:
      self._response['body'] = "Default backend for the XENA Training APP"
      self._response['statusCode'] = 200

    return self._response
