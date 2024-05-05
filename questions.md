## Q-1. What is the difference between Component and PureComponent?  Give an example where it might break my app.

React Component and PureComponent are base classes that can be used to create your own components. The difference between them in the way they manage state and props.

**1. Regular Component:**
- A regular Component in React This is the base class for React components that extend React.Component class. Regular Components have access to the component lifecycle methods and can manage their state.
- By default, a regular Component will re-render every time its parent component re-renders or when its own state or props change. This can lead to unnecessary re-renders of components and their children. below is an example of a regular component.

``class RegularComponent extends Component {
  render() {
    return <div>{this.props.message}</div>;
  }
}``

**2. PureComponent Component:**
- A PureComponent in React is a class-based component that extends React.PureComponent class. Like regular Components, PureComponents have access to the component lifecycle methods and can manage their state.
- The key difference is that PureComponent performs a shallow comparison of the component's props and state objects before deciding whether to re-render. If there are no changes, PureComponent prevents a re-render, optimizing performance by avoiding unnecessary updates. below is an example of a pure component.

`` class MyPureComponent extends PureComponent {
  render() {
    return <div>{this.props.message}</div>;
  }
}``


 ##### Example where using both regular and pure components can break your app 

 ```import React, { Component, PureComponent } from 'react';

class Counter extends PureComponent {
  render() {
    return <div>{this.props.count}</div>;
  }
}

class IncrementButton extends Component {
  render() {
    return <button onClick={this.props.onClick}>Increment</button>;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <Counter count={this.state.count} />
        <IncrementButton onClick={this.incrementCount} />
      </div>
    );
  }
} 
```




Code explanation :
The problem arises because the App component contains a PureComponent `Counter` and a regular Component `IncrementButton`. Whenever the `Increment` button is clicked and the state of `App` changes, `IncrementButton` will always re-render, even if its props haven't changed. This is because `App` re-renders, and since `IncrementButton` is just a regular Component, it will always re-render when its parent component does, even if there's no need to.

This can cause performance issues, if IncrementButton is resource-intensive or if `App` re-renders frequently. To avoid this, it's best to ensure consistency by using either Component or PureComponent consistently throughout your component hierarchy.


## Q-2. Context + ShouldComponentUpdate might be dangerous. Why is that?

First, let's describe the functions of the Context and shouldComponentUpdate. These two features are important in React development.

**1. ShouldComponentUpdate :**
This is a lifecycle method that re-renders only when there is a change in the state or props of a component and that change will affect the output. it is frequently utilized to enhance performance by avoiding unnecessary re-renders

**2. Context :**
provides a way to pass data through the component tree without having to pass props down manually at every level

##### Disavantages using Context + ShouldComponentUpdate:

1. Maintenance: As more features are added to the application, managing the communication between updates to context and component rendering logic becomes increasingly complex. It makes it more difficult to maintain and debug code that heavily relies on shouldComponentUpdate in conjunction with context.
   
2. stale context values:  If a component's shouldComponentUpdate method relies on context values that are asynchronously updated, there's a risk that the component may base its rendering decision on stale or outdated context data. This can lead to inconsistencies between the rendered output and the actual state of the application.
   
3. Granularity of updates: The method `shouldComponentUpdate` works at the component level. When multiple components within a subtree are using the same context, and the context value changes, it can be difficult to control which components need to be re-rendered. This situation can have an impact on performance, causing either too many or too few re-renders.

4. tracking dependencies: When components consume values from a Context, it can get complicated to determine the dependencies that affect the rendering process. Even if the context value changes, it may not always be clear which components should re-render as a result.

##### Solution to these challenges:

1. Reserve context for values that truly need to be shared across multiple levels of your component tree.
2. Use functional components, functional components offer a more straightforward and predictable way to consume context values, with hooks like UseState() and UseMemo you will not need to use `shouldComponentUpdate`
3. Testing your application thoroughly can help catch regressions and unexpected behavior resulting from interactions between context and rendering optimizations

## Q-3. Describe 3 ways to pass information from a component to its PARENT.

**1. Callback Functions:**
- Create a callback function in the parent component and pass it down to the child component as a prop.
- In the child component, you now have access to the callback in the parent component, call the callback function with the argument you want to send to the parent component.
- This allows the child component to pass information to the parent component.

Code Example:
```
import React, { useState } from 'react';
import ChildComponent from './ChildComponent';

//parent component
function ParentComponent() {
  const [ childData, setChildData ] = useState('');

  const handleChildData = (data) => {
    setChildData(data);
  };

  return (
    <main>
      <ChildComponent sendDataToParent={handleChildData} />
    </main>
  );
}

export default ParentComponent;

// Child component
import React from 'react';

 const ChildComponent = ({ sendDataToParent }) => {
  const handleButtonClick = () => {
    sendDataToParent('Hello!! parent!');
  };

  return (
    <button onClick={handleButtonClick}>Send parent information</button>
  );
}

export default ChildComponent;
```
**2. Utilize state management:**
 - Use state management libraries to manage application states globally. you can make use of dispatch actions in Components to manipulate the state globally, and parent components can subscribe to changes in the state to react accordingly.
 - Examples of state management libraries are Redux or MobX.

**3. Context API:**
React's Context API provides a way to pass data through the component tree without having to pass props down manually at every level.
- Create a context in a higher-level component and provide a context value.
- the child components can access this context value using the useContext hook or the Consumer component.
Check Example Below:

```
const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState('');

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

// Parent.js
import React from 'react';
import { useData } from './DataContext';

const Parent = () => {
  const { data, setData } = useData();

  const handleDataFromChild = (childData) => {
    setData(childData);
  };

  return (
    <div>
      <Child sendToParent={handleDataFromChild} />
    </div>
  );
}

export default Parent;

// Child.js
import React from 'react';
import { useData } from './DataContext';

const Child = ({ sendToParent }) => {
  const { setData } = useData();

  const handleClick = () => {
    sendToParent('send this to parent');
  };

  return (
    <button onClick={handleClick}>Send Data to Parent</button>
  );
}

export default Child;
```

## Q-4 Give 2 ways to prevent components from re-rendering.

**1. Memoization:**
 - Memoization is an optimization technique for accelerating computer programs by caching the results of heavy function calls and returning them when similar inputs are encountered repeatedly.
 - In React, you can use the React.memo higher-order component or the useMemo hook to memoize functional components. By doing so, React will only re-render the component if its dependencies have changed.

Example with useMemo
```
import React, { useMemo } from 'react';

const Component = ({ data }) => {
  const info = useMemo(() => getInfo(data), [data]);

  return <div>{info}</div>;
}
```

Example with React,memo

```
import React from 'react';

const Component = React.memo(function Component(props) {

});

export default Component;
```

**2. React.useCallBack**
- The useCallBack hook memoizes functions so they are not recreated on each component render.
- When memoized with useCallback, a function will only be created once and reused on subsequent renders if the function’s dependencies remain the same.

Code Example:
```
import React, { useCallback } from 'react';

const Component = ({ onClick }) => {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button onClick={handleClick}>Click me</button>
  );
};

export default Component;
```
## Q-5 What is a fragment and why do we need it? Give an example where it might break my app.

A fragment in React is a lightweight wrapper that allows you to return multiple elements from a React component. It's essentially a way to group multiple children elements without adding extra nodes ( Div or wrapper ) to the DOM.

**Advantages :**

1. Fragments help to keep the HTML structure clean and more semantic by allowing you to group elements without introducing extra divs or other elements that might affect the layout or styling.
2. it also improves performance by reducing the number of unnecessary nodes in the DOM.

**Examples where it can break the APP:**

1. Screen readers and other assistive technologies might interpret the DOM differently when fragments are used, potentially affecting accessibility.
2. If your CSS selectors rely on the parent-child relationship in the DOM tree, using fragments might disrupt your styling.
3. If your JavaScript code relies on the structure of the DOM, using fragments could potentially break functionality

Code Example:
```
import React from 'react';

const Component = () => {
  render() {
    return (
      <>
        <p>React Fragment</p>
        <h1>Fragment h1</h1>
      </>
    );
  }
}
```
## Q-6 Give 3 examples of the HOC pattern.

**HOC**: A React design pattern commonly used in React for code reuse, abstraction, and composability.

Code Example:
```
import React from 'react';
import { Redirect } from 'react-router-dom';

const Authentication = (ChildComponent) => {
  const AuthenticatedComponent = (props) => {
    const isAuthenticated = checkIfUserIsAuthenticated(); // Some authentication logic

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return <ChildComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default Authentication;
```
usage:
```
import React from 'react';
import Authentication from './Authentication';

const Dashboard = () => {
  // Component logic
};

export default Authentication(Dashboard);
```
##### Examples of the HOC pattern:

**1. Authentication:**
- A higher-order component that adds authentication logic to a component.
- it ensures that only authenticated users can access certain components or routes in your application.
- It checks if the user is authenticated and redirects them to another page that can be viewed by the user.
   
**2. To indicate App loading:**
- A higher-order component that adds a loading indicator state that fetches data asynchronously to a component.
- It wraps the target component and manages a loading state, It displays a loading spinner while data is being fetched asynchronously The HOC adds a loading indicator to components that fetch data asynchronously.
- It wraps the target component and manages a loading state. While the data is being fetched, it displays a loading indicator.

**5. App Theme:**
- A higher-order component that adds theme support to a component. It passes down a theme object as props to the wrapped component.
- this way, the wrapped component can easily access and apply the appropriate styles based on the provided theme.

## Q7 What's the difference in handling exceptions in promises,callbacks and async...await?

The 3 of them are used to handle Asynchronous computations in javascript

**1. Promises:**
- Promises are designed to handle a single asynchronous value or error.
- With promises, you use .then() to handle success and .catch()  and error cases.
- Errors are propagated down the promise chain until they are caught by a .catch()
- You can also handle errors globally using Promise.prototype.catch() to catch any unhandled rejections in the entire application.
- A Promise has three states: pending, fulfilled, or rejected. It transitions from pending to either fulfilled (resolved with a value) or rejected (resolved with an error).

Code Example:
```
  Promise.then(result => {
  //success
}).catch(error => {
  // error
});
```

**2.Callbacks:**
- Callbacks are functions that are called when an asynchronous operation completes
- you can pass an error object as the first argument to the callback function if an error occurs.
- Errors are typically handled within each callback function, making error handling more manual and prone to "callback hell".
- It's a common practice to check for errors in the callback function and handle them accordingly.
  
Code Example:
```
function fetchInfo(callback) {
  if (error) {
    callback(new Error('Failed to fetch data'));
  } else {
    callback(null, data);
  }
}

fetchInfo((err, result) => {
  if (err) {
    // Handle error
  } else {
    // Handle success
  }
});
```

**2. Async/Await:**
- When working with asynchronous operations, try...catch blocks can be used to handle exceptions.
- This makes error handling easier and more similar to synchronous code
- If an await expression fails, the try/catch block will catch the error, allowing it to be handled with ease.
- Errors within async functions are caught by the nearest try/catch

Code Example:
```
async function fetchInfo() {
  try {
    const result = await myAsyncFunction();
    // success
  } catch (error) {
    // error
  }
}
```
## Q-8 How many arguments does setState take and why is it async?
- setState function in React accepts only one argument.
- This argument can be either an object or a function.
- If you use the function form of setState, it takes two parameters within the function itself: the previous state and the current props.
  
**1. Object Argument:**
   - passing an object to setState, you're providing the new state that you want to merge with the current state of the component. This form of setState is used for simple state updates where the new state doesn't depend on the previous state.
   
Example Code:
  ```
this.setState({ count: this.state.count + 1 })
```
**2. Function Argument:**
- When you pass a function to setState, you're providing a function that receives the previous state and current props as arguments, and returns the new state object.
- If you want your program to update the value of a state using setState and then perform certain actions on the updated value of the state
- This form of setState is used when the new state depends on the previous state or props.

Example Code:
```
this.setState((prevState, props) => ({
  count: prevState.count + props.increment
}));
```

##### Why is setState async?

When you call setState(), it doesn't change the component's state immediately. Instead, it creates a pending state transition. Accessing this.state immediately after calling setState() can potentially return the previous value, as the state may not have been updated yet. multiple calls may be batched together for performance reasons.

## Q-9 List the steps needed to migrate a Class to a Function Component.

##### steps to migrate to a functional component:
1. Remove the render method in use the ``return()`` instead
2. Remove references to this, change to normal javascript functions
3.  Remove ``constructor(props)``, and replace it with React hook ``useState()``
4.  Remove event handler bindings
5.  Replace ``this.setState`` with relevant state variable setter from ``useState()``
6.  Replace lifecycle methods with hooks
7.  Change the class component wrapper to a function

Example of a Class Component:
```
class Component extends React.Component {
  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);

    this.state = {
      counter: 0,
      name: "",
    };
  }

  componentDidMount() {
    console.log("component mounted!");
  }

  componentWillUnmount() {
    console.log("component will unmount");
  }

  componentDidUpdate() {
    console.log("component Did Update");
  }

  myFunction() {
    console.log("hello");
  }
  onClickHandler(e) {
    this.myFunction();
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return <p>{this.counter}</p>;
  }
}
```

Example of the migrated Class component(above component) to Functional component:
```
  const Component = (props) => {
    const [counter,setCounter] = useState(0);
    const [name,setName] = useState("");

    useEffect(()=>{
        console.log('component mounted!')
        return () => {
            console.log('component will unmount')
          }
      },[])

      useEffect(() => {
        console.log('component updated!')
      })

   const myFunction = () => {
        console.log('hello')
      }
    const onClickHandler = (e) => {
        myFunction()
        setCount(count+1);
      }
    return (<p>{counter}</p>);
  }
```

## Q-10 List a few ways styles can be used with components.


**1. CSS Stylesheets:**
   Create separate CSS files, import them into components, and use class names in components.

Code Example:
```
   // styles.css
.component-style {
  color: red;
  font-size: 16px;
}

// Component
import React from 'react';
import './styles.css';

const Component = () => {
  return <div className="component-style">Hello, world!</div>;
};

export default Component;
```
**2. Inline Styles:**
In inline styling basically, we create objects of style. And render it inside the components in style attribute using the React technique to incorporate JavaScript variables inside the JSX.

Code Example:
```
const Component = () => {
  const styles = {
    backgroundColor: 'blue',
    marginRight: '16px',
  };

  return <div style={styles}>Hello!</div>;
};
```

**3. CSS-in-JS Libraries:**
'react-jss' integrates JSS with React to style components using Javascript instead of CSS. Libraries like styled-components or Emotion allow you to define styles using JavaScript template literals or JSX syntax directly within your components, offering dynamic styling capabilities and encouraging component-driven design.

Code Example:
```
import styled from 'styled-components';

const StyledDiv = styled.div`
    backgroundColor: 'blue',
    marginRight: '16px',
`;

const Component = () => {
  return <StyledDiv>Hello!</StyledDiv>;
};

```

**4. CSS Frameworks:**
You can style your React components easily by utilizing pre-built CSS frameworks like Bootstrap, Material-UI, or Tailwind CSS. These frameworks come with a set of predefined styles and components that you can readily integrate into your application.


## Q-11 How to render an HTML string coming from the server.

**1. Use ``dangerouslySetInnerHTML``:**
-  When using this approach, it is important to be cautious as it can expose your application to cross-site scripting (XSS) attacks if the HTML string is not properly sanitized.

Code Example:
```
import React from 'react';

const MyComponent = ({ htmlString }) => {
  const htmlString = "Hello am HTML <b>a bold text</b> and <b>another one</b>.";;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlString }} />
  );
};

```
**2. Using Third-party Libraries:**
   You can achieve the same functionality as dangerouslySetInnerHTML by using third-party libraries. Some examples of these libraries are:
   
   - html-react-parser
   - react-html-parser
   - html-to-react


