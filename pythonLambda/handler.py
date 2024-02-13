from router import Router

def lambda_handler(event, context):
    print("-------- invoking lambda ---------")
    print(event)
    print("------- done printing event. Now invoking router -------")
    # sending event to the router
    return Router().route(event)
