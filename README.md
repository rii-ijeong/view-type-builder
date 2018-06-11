# view-type-builder

## Installation
### API
1. Will need a working DynamoDB Access Key and Secret Key.
2. Go to `api/src/main/resources/application.properties`.
3. Add the following lines: 

`server.port={Insert port number}`

`amazon.dynamodb.endpoint={Insert DynamoDB endpoint. Ex. https://dynamodb.us-west-1.amazonaws.com`

`amazon.aws.accesskey={Insert DynamoDB Access Key}`

`amazon.aws.secret={Insert DynamoDB Secret Key}`

4. In the `api` root directory, run `mvn clean install`.

Note: Your DynamoDB will need to have three tables: `enum` `type` and `viewDefinition`, each with `id` as a primary key.

### Running The Application

In the root directory, run `yarn dev`.

### Examples

#### Type Definition
![type def example](https://thumbs.gfycat.com/ExcitableMenacingIslandwhistler-size_restricted.gif "Type Definition Example")

#### View Definition
![view def example](https://thumbs.gfycat.com/ForthrightIncompatibleAttwatersprairiechicken-size_restricted.gif "View Definition Example")
