import React, { Component } from "react";

import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { Link } from "react-router-dom";

import UserAvatar from "../UserAvatar";

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        anchorEl: null
      }
    };
  }

  openMenu = event => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl
      }
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null
      }
    });
  };

  render() {
    // Properties
    const { performingAction, user, userData, roles } = this.props;

    // Events
    const {
      onAboutClick,
      onSettingsClick,
      onSignOutClick,
      onSignUpClick,
      onSignInClick
    } = this.props;

    const { menu } = this.state;

    const menuItems = [
      {
        name: "About",
        onClick: onAboutClick
      },
      {
        name: "Profile",
        to: user ? `/user/${user.uid}` : null
      },
      {
        name: "Settings",
        onClick: onSettingsClick
      },
      {
        name: "Sign out",
        divide: true,
        onClick: onSignOutClick
      }
    ];

    return (
      <AppBar color="primary" position="static">
        <Toolbar>
          <Box display="flex" flexGrow={1}>
            <Typography color="inherit" variant="h6">
              {process.env.REACT_APP_TITLE}
            </Typography>
          </Box>

          {user && (
            <>
              {roles.includes("admin") && (
                <Box mr={1}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    variant="outlined"
                  >
                    Admin
                  </Button>
                </Box>
              )}

              <IconButton
                color="inherit"
                disabled={performingAction}
                onClick={this.openMenu}
              >
                <UserAvatar user={Object.assign(user, userData)} />
              </IconButton>

              <Menu
                anchorEl={menu.anchorEl}
                open={Boolean(menu.anchorEl)}
                onClose={this.closeMenu}
              >
                {menuItems.map((menuItem, index) => {
                  if (
                    menuItem.hasOwnProperty("condition") &&
                    !menuItem.condition
                  ) {
                    return null;
                  }

                  let component = null;

                  if (menuItem.to) {
                    component = (
                      <MenuItem
                        key={index}
                        component={Link}
                        to={menuItem.to}
                        onClick={this.closeMenu}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  } else {
                    component = (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          this.closeMenu();

                          menuItem.onClick();
                        }}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  }

                  if (menuItem.divide) {
                    return (
                      <span key={index}>
                        <Divider />

                        {component}
                      </span>
                    );
                  }

                  return component;
                })}
              </Menu>
            </>
          )}

          {!user && (
            <ButtonGroup
              color="inherit"
              disabled={performingAction}
              variant="outlined"
            >
              <Button onClick={onSignUpClick}>Sign up</Button>
              <Button onClick={onSignInClick}>Sign in</Button>
            </ButtonGroup>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Bar.defaultProps = {
  performingAction: false
};

Bar.propTypes = {
  // Properties
  performingAction: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userData: PropTypes.object,

  // Events
  onAboutClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired
};

export default Bar;
