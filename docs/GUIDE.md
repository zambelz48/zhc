# Guide

FORMAT: zhc <COMMAND> <OPTIONS>

## Initialize
```sh
$ zhc init
```
## Structure
```
- .zhc
  - config.jsonc
    - profiles
      - default
        - env 
          - default.jsonc 
        - endpoints
          - default.jsonc
      - profile1
        - env 
          - default.jsonc 
        - endpoints
          - default.jsonc
          - otherEndpoint.jsonc
          - someGroup1
            - default.jsonc
          - someGroup2
            - subGroup
              - default.jsonc
```
#### Content
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
    "baseURL": "https://google.com",
    "tokenFromEnv": "some_token_from_env"
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
        "someGeneratedNumber": "<#randomNumber#>"
      }
    }
  }
  ```
## Features
#### Config Management
```sh
$ zhc config
```

#### Profile Management
- Add
  ```sh
  $ zhc profile -a "Profile Name"
  $ zhc profile --add "Profile Name"
  ```
- Rename
  ```sh
  $ zhc profile -r "Current Profile Name" "New Profile Name"
  $ zhc --profile --rename "Current Profile Name" "New Profile Name"
  ```
- List
  ```sh
  $ zhc profile -l
  $ zhc profile --list
  ```
  - output:
    ```
    Profiles:
    1. default (env: 1 | endpoints: 5)
    2. profile1 (env: 2 | endpoints: 10)
    ```
- Remove
  ```sh
  $ zhc profile -R "Profile Name"
  $ zhc profile --remove "Profile Name"
  ```
- Change Default
  ```sh
  $ zhc profile -D "Profile Name"
  $ zhc profile --default "Profile Name"
  ```

#### API Management
- Open  
  ```sh
  $ zhc api -o "Profile Name"
  $ zhc api --open "Profile Name"
  ```
- List
  ```sh
  $ zhc api -l "Profile Name"
  $ zhc api --list "Profile Name"
  ```  
  - output:  
    ```
    Endpoints (Profile Name):
    1. default
      - [POST] "default/endpoint/one"
    2. otherEndpoint
      - [PUT] "otherEndpoint/endpoint/one"
    3. [GROUP] group1
      - default
        - [GET] "some/endpoint/one"
    4. [GROUP] group2
      - [GET] "some/endpoint/one"
      - [GROUP] subgroup1
        - default
          - [GET] "some/endpoint/one"
          - [POST] "some/endpoint/two"
        - otherEndpoint
          - [POST] "some/endpoint/two"
    ```
- Call  
  - open prompt first:
    ```sh
    $ zhc api -c "endpoint"
    $ zhc api --call "endpoint"
    ```  
    - output:
      ```
      1. Execute
      2. Edit
      Your choice?:_
      ```  

  - direct execute:
    ```sh
    $ zhc api -c "endpoint" -E
    $ zhc api --call "endpoint" --execute
    ```  

  - open editor first before execute:
    ```sh
    $ zhc api -c "endpoint" -e
    $ zhc api --call "endpoint" --edit
    ```

#### Utilities
- Doctor
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
