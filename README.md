# RNDemo5 - Authentication

1. Walk through the code:

   - Show them the `LoginForm` and the state.

#### Basic Auth

2.

# RNDemo5 - Authentication

1. Walk through the code:

   - Show them the `LoginForm` and the state.
   - Show them the `handleChange` method. It is still not wired, so let's go ahead and work on that.
   - Type in the fields, show that in the console, nothing is being updated in the state.

#### onChangeText

2. add `onChangeText` to both form inputs.

````jsx
          <Form>
            <Item>
              <Input
                name="username"
                value={username}
                placeholder="Username"
                onChangeText={username => this.handleChange({ username })}
              />
            </Item>
            <Item last>
              <Input
                value={password}
                placeholder="Password"
                name="password"
                onChangeText={password => this.handleChange({ password })}
              />
            </Item>
            <Button>
              <Text>Login</Text>
            </Button>
          </Form>
          ```
````

3. Type to show them that the console is logging now. The state is being updated.

4. Inside `redux/actions`, create a `auth.js` file. Copy and paste this:

```javascript
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AsyncStorage } from "react-native";

import * as actionTypes from "./actionTypes";

const setAuthToken = token => {
  if (token) {
    AsyncStorage.setItem("token", token);

    axios.defaults.headers.common.Authorization = `jwt ${token}`;
  } else {
    AsyncStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
  }
};

export const checkForExpiredToken = () => {
  return async dispatch => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      const currentTime = Date.now() / 1000;

      const user = jwt_decode(token);

      if (user.exp >= currentTime) {
        setAuthToken(token);

        dispatch(setCurrentUser(user));
      } else {
        dispatch(logout());
      }
    }
  };
};

export const login = (userData, navigation) => {
  return async dispatch => {
    try {
      let response = await axios.post(
        "https://precious-things.herokuapp.com/login/",
        userData
      );
      let user = response.data;
      let decodedUser = jwt_decode(user.access);
      setAuthToken(user.access);
      await dispatch(setCurrentUser(decodedUser));
    } catch (error) {
      console.error(error);
    }
  };
};

export const signup = userData => {
  return async dispatch => {
    try {
      let response = await axios.post(
        "https://precious-things.herokuapp.com/signup/",
        userData
      );
      let user = response.data;
      let decodedUser = jwt_decode(user.access);
      setAuthToken(user.access);
      dispatch(setCurrentUser(decodedUser));
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERRORS,
        payload: error.response.data
      });
    }
  };
};

export const logout = () => {
  setAuthToken();
  return setCurrentUser();
};

const setCurrentUser = user => ({
  type: actionTypes.SET_CURRENT_USER,
  payload: user
});
```

5. Navigation in React Native is identical to React with one exception. We use `asyncStorage` instead of `localStorage`.

6. Complete `Redux`. In `reducers/index.js`, uncomment the code. This is something we have seen before and nothing has changed much.

7. In `App.js`:

```jsx
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

//Redux
import store from "./redux/reducers";
import { Provider } from "react-redux";

//Components
import LoginForm from "./components/LoginForm";

export default function App() {
  return (
    <Provider store={store}>
      <LoginForm />
    </Provider>
  );
}
```

8. In Postman, register using `"https://precious-things.herokuapp.com/signup/"`

9. Now, modify `LoginForm.js`:

```JSX
import React, { Component } from "react";
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Button,
  Text
} from "native-base";

import { connect } from "react-redux";

// Actions
import { login } from "../redux/actions/auth";

class LoginForm extends Component {
  state = {
    username: "",
    password: ""
  };
  handleChange = object => {
    console.log("this is the object" + object);
    this.setState(object);
  };

  handleSubmit = event => {
    this.props.login(this.state);
  };

  render() {
    const { username, password } = this.state;
    console.log(this.state);
    return (
      <Container>
        <Header />
        <Content>
          <Form>
            <Item>
              <Input
                name="username"
                value={username}
                placeholder="Username"
                onChangeText={username => this.handleChange({ username })}
              />
            </Item>
            <Item last>
              <Input
                value={password}
                placeholder="Password"
                name="password"
                onChangeText={password => this.handleChange({ password })}
              />
            </Item>
            <Button onPress={this.handleSubmit}>
              <Text>Login</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    login: userData => dispatch(login(userData))
  };
};
export default connect(
  null,
  mapDispatchToProps
)(LoginForm);
```

10. Show the action being dispatched in the dev tools.
# RN_task5_Auth
