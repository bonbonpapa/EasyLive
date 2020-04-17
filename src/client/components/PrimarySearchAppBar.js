import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import StoreOutlinedIcon from "@material-ui/icons/StoreOutlined";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import MoreIcon from "@material-ui/icons/MoreVert";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";

const NavbarLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.25rem;
`;
const MenuLink = styled(Link)`
  color: black;
  text-decoration: none;
`;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  root: {
    //backgroundColor: "#2196F3";
    background: "linear-gradient(260deg, #2376ae 0%, #c16ecf 100%)",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200,
    },
  },
  cartIcon: {
    paddingTop: 5,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

function PrimarySearchAppBar({ history, handleLogout }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const query = useSelector((state) => state.searchQuery);
  const lgin = useSelector((state) => state.loggedIn);
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const shoppingListCount = cart
    ? cart.products.reduce((total, product) => {
        return total + product.quantity;
      }, 0)
    : 0;

  // const shoppingListCount = useSelector(state => state.shoppingList.length);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleQuery = (event) => {
    dispatch({ type: "query", content: event.target.value });
  };

  // const handleLogout = event => {
  //   fetch("/logout", { method: "POST", credentials: "same-origin" });
  //   history.push("/");

  //   dispatch({ type: "log-out" });
  // };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <MenuLink to="/profile">Profile</MenuLink>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <MenuLink to="/account">My Account</MenuLink>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        {lgin ? (
          <IconButton onClick={handleLogout}>Logout</IconButton>
        ) : (
          <MenuLink to="/sign">Sign</MenuLink>
        )}
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="sell items" color="inherit">
          <StoreOutlinedIcon />
        </IconButton>
        <MenuLink to="/updateItems">Sell Items</MenuLink>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show items in the cart" color="inherit">
          <Badge badgeContent={shoppingListCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <MenuLink to="/shoppingcart">Cart</MenuLink>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <NavbarLink to="/">
              <div className={classes.cartIcon}>
                <MenuIcon />
              </div>
            </NavbarLink>
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            <NavbarLink to="/">EASY LIVE</NavbarLink>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={handleQuery}
              value={query}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="manager live" color="inherit">
              <NavbarLink to="/manager">STREAM MANAGER</NavbarLink>
            </IconButton>
            <IconButton aria-label="buy item" color="inherit">
              <NavbarLink to="/buy">BUY</NavbarLink>
            </IconButton>
            <IconButton aria-label="sell items" color="inherit">
              <NavbarLink to="/updateItems">SELL</NavbarLink>
            </IconButton>
            <IconButton aria-label="show cart content" color="inherit">
              <Badge badgeContent={shoppingListCount} color="secondary">
                <NavbarLink to="/shoppingcart">
                  <div className={classes.cartIcon}>
                    <ShoppingCartIcon />
                  </div>
                </NavbarLink>
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user && user.photo ? (
                <Avatar alt="Remy Sharp" src={user.photo} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
export default withRouter(PrimarySearchAppBar);
