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
  handleChange = keyValue => {
    this.setState(keyValue);
  };

  handleSubmit = () => {
    this.props.login(this.state)  };

  render() {
    const { username, password } = this.state;
    console.log(this.state);
    return (
      <Container>
        <Header />
        <Content>
          <Form>
          <Item rounded>
              <Input name="username" value={username} placeholder="Username" onChangeText={username=>this.handleChange({username})} />
            </Item>
            <Item rounded last>
              <Input
                value={password}
                placeholder="Password"
                secureTextEntry
                name="password"
                onChangeText={password=>this.handleChange({password})}
              />
            </Item>
            <Button rounded info onPress={this.handleSubmit}>
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