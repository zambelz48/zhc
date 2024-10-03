# Guide

FORMAT: `zhc <COMMAND> <OPTIONS>`

### Table of Contents
- [Initialize](#initialize)
- [Config Folder Structure](#config-folder-structure)
- [Example](#example)
- [Available Commands](#available-commands)
  - [Config Management](#config-management)
  - [Profile Management](#profile-management)
  - [API Management](#api-management)
  - [Utilities](#utilities)

### Initialize
This command will generate the initial configuration 
```sh
$ zhc config --init
```

### Config Folder Structure
The root configuration will be located inside user's home directory, the name is `.zhc` with the following structure:
```
├── config.jsonc
├── profiles (the collections is separated by profile)
│   ├── default (this is the default profile, if you don't pass '-p' option, then this profile will be selected)
│   │   ├── config.jsonc
│   │   ├── endpoints
│   │   │   └── default.jsonc
│   │   └── env
│   │       └── default.jsonc
│   └── another_profile (this is your custom profile. you have to pass '-p <YOUR_DESIRED_PROFILE>' when doing api call)
│       ├── config.jsonc
│       ├── endpoints
│       │   ├── auth
│       │   │   └── login.jsonc
│       │   └── user
│       │       └── profile.jsonc
│       └── env
│           ├── dev.jsonc
│           ├── stg.jsonc
│           ├── prod.jsonc
│           └── any-other.jsonc
└── scripts
    ├── your_post_script.js (this is pre-request script (only 'js' for now))
    ├── your_pre_script.js (this is post-request script (only 'js' for now))
    ├── sample_go_script.go
    ├── sample_node_script.js
    ├── sample_python_script.py
    ├── sample_ruby_script.rb
    └── sample_shell_script.sh
```
### Example
Suppose we have the [above structure](#config-folder-structure), and we want to execute `login` endpoint inside `another_profile/endpoints/auth` using `dev` environment variable
then we can achieve it by executing the following command:
```
$ zhc api -p another_profile -e dev -c auth:login
```
if we want to be more dynamic, we can also pass some arguments to change the predefined request parameters
```
$ zhc api -p another_profile -e dev -c auth:login -a "username=admin:password=123456"
```

### Available Commands
##### Config Management
- Commands
  ```sh
  $ zhc config [options]
  ```
- Options
  ```
  [MANDATORY] -i | --init
  ```

##### Profile Management
- Commands
  - Add
    ```sh
    $ zhc profile -a "Profile Name"
    $ zhc profile --add "Profile Name"
    ```
  - Remove
    ```sh
    $ zhc profile -R "Profile Name"
    $ zhc profile --remove "Profile Name"
    ```
- Options
  ```
  [MANDATORY] -a | --add  --> mandatory for create new profile
  [MANDATORY] -R | --remove  --> mandatory for removing profile
  ```

##### API Management
- Commands
  - List
    ```sh
    $ zhc api -p <SELECTED_PROFILE> -l
    ```
    - output:
      ```
      API List (<SELECTED_PROFILE>)
  
      • endpoint_collection_one:
        • auth:
          • login: [POST] /auth/v1/login
          • register: [POST] /auth/v1/register
      • endpoint_collection_two:
        • user:
          • get_profile: [GET] /user/v1/profile/user-123
      ```
  - Call  
    - Perform api call:
      ```sh
      $ zhc api -p <SELECTED_PROFILE> -e <SELECTED_ENV> -c "your_collection:file_name:endpoint_name"
      ```  
- Options
  ```
  [OPTIONAL]  -p | --profile  --> target profile  
  [OPTIONAL]  -e | --env      --> target env  
  [MANDATORY] -c | --call     --> target endpoint. it should follow the folder structure of the endpoint  
  [OPTIONAL]  -a | --args     --> arguments to replace the predefined request parameters
  [OPTIONAL]  -v | --verbose  --> bring more information about the request as well as all console.log in your custom scripts will be printed out  
  ```

##### Utilities
- Commands
  - Doctor (Coming Soon)
    ```sh
    $ zhc doctor
    ```  
    output:
    - Green
      ```
      ZHC Doctor:
      - Base URL is all set in all environment
      - Missing environment variables: 0
      - Duplicate endpoints: 0
      ```
    - Red
      ```
      ZHC Doctor:
      - Base URL issue
        - "Profile Name" | "EnvName" is not set
      - Missing environment variables: 1
        - variable "someVar" is not set
      - Duplicate endpoints: 1
        - [FILE_NAME] "/this/endpoint/duplicate" | [FILE_NAME] "this/endpoint/duplicate"
      ```

### Content
- config
  ```json
  {
    "defaultProfile": "default",
    "editor": "nvim"
  }
  ```
- env
  ```json
  {
    "protocol": "https",
    "baseURL": "google.com",
    "tokenFromEnv": "some_token_from_env",
    "anyOtherVar": "bla bla"
  }
  ```
- endpoint
  ```json
  {
    "/some/endpoint": {
      "method": "GET",
      "headers": {
        "Authorization": "Bearer {{tokenFromEnv}}",
        "Content-Type": "application/json"
      },
      "params": {
        "someId": "123",
        "someGeneratedNumber": "<#randomNumber#>",
        "valueFromShellCmd": "<%shell:(echo 'Hello')%>",
        "valueFromScript": "<%script:some_script(hello, world)%>"
      },
      "scripts": {
        "pre": "some_pre_script",
        "post": "some_post_script"
      }
    }
  }
  ```
### Scripts
##### Request Scripts
- Pre-request  
  This script is executed before performing api call. we can access the environment
  variable and playing around with it.
  Sample:
  ```js
  const userAge = variables.userAge
  if (userAge > 30) {
    variables.userType = "veteran"
  } else {
    variables.userType = "youngster"
  }
  ```
- Post-request  
  This script is executed right after the api call is finished their execution. 
  we can access the response from the given api call. also, you still have access the variable here
  ```js
  const statusCode = response.status
  const headers = response.headers
  const body = response.body

  if (statusCode === 200) {
    variables.jwtToken = body.access_token
  }
  ```
NOTE: *you should define the pre-request and post-request script in the api spec*
```json
{
  ...
  "scripts": {
    "pre": "pre_script_filename",
    "post": "post_script_filename"
  }
}
```
##### Custom Script
We also have some custom script to be included in the api call flow. 
for instance, when we want to fill some variable from some complex logic and you don't comfortable with js syntax in pre-script
```go
///opt/homebrew/bin/go run $0 $@; exit

package main
import ( 
    "fmt"
    "os"
)

func main() {
    args := os.Args[1:]
    fmt.Println("get returned value from go script: ", args)
}
```
you can set it in the headers or params in api specs
```json
...
headers: {
  "someKey": "<%script:your_script_filename(10)%>"
  ...
}
...
```

