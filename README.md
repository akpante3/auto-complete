
<a name="readme-top"></a>




<!-- ABOUT THE PROJECT -->
## About The Project

<img width="1145" alt="Screenshot 2024-05-05 at 2 08 33 PM" src="https://github.com/akpante3/auto-complete/assets/37974813/be301528-c0fe-409a-b121-ab91699e0e9f">


- This mini project uses a University API to test an auto-complete input for fetching and filtering data.
- The input can also be used for various data



### Built With

![React](https://img.shields.io/badge/-React-61DBFB?style=for-the-badge&labelColor=black&logo=react&logoColor=61DBFB)
![Typescript](https://img.shields.io/badge/Typescript-007acc?style=for-the-badge&labelColor=black&logo=typescript&logoColor=007acc)
![Javascript](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?logo=jest)](https://github.com/jestjs/jest)



<!-- GETTING STARTED -->
## Getting Started

Instructions for setting up this project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
* node <a href="https://nodejs.org/en">Download</a>
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
     ```sh
     https://github.com/akpante3/grouped-tasks.git
     ```
2. Cd into the project directory
     ```sh
     cd grouped-tasks
     ```
3. Install NPM packages
     ```sh
     npm install
     ```
4. Start project
     ```sh
     npm run start
     ```
If you did everything right from Installation 👆🏾: The project should be available at http://localhost:3000/


Run Test: 
1.  ```sh
    npm run test
      ```





<!-- USAGE EXAMPLES -->
## Usage

#### Components

1. AutoCompleteInput
   
| Prop | Description | Type |
| --- | --- | --- |
| getOptions |  A function that asynchronously fetches options based on user input change (onChange) events. | Promise<string[]> |
| inputPlaceHolder |  Placeholder text displayed in the input field when it's empty  | string |
| disableInput | Determines whether the input field is disabled, preventing user interaction | boolean |
| classes | An array of custom CSS classes to style the AutoCompleteInput component |string[] |
| defaultInputValue | Specifies a default value to be displayed in the input field |string |
| inputLabel | Specifies the Input <label> |string |

**Pending Features**

| Prop | Description | Type |
| --- | --- | --- |
| options | Allows the use of a static option list, but not simultaneously with `getOptions`. | string[] |


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] UI Implementation
- [x] API Implementation 
- [x] Testing


<p align="right">(<a href="#readme-top">back to top</a>)</p>



