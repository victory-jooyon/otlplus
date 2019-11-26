import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import userShape from '../../shapes/UserShape';

import { guidelineBoundClassNames as classNames, appBoundClassNames } from '../../common/boundClassNames';

import logoImage from '../../static/img/Services-OTL.svg';


class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileMenuOpen: false,
      noBackground: false,
    };
  }


  componentDidMount() {
    window.addEventListener('scroll', this.setNoBackground);
    this.setNoBackground();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (location.pathname !== prevProps.location.pathname) {
      this.setNoBackground();
      this.closeMenu();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setNoBackground);
  }


  closeMenu = () => {
    this.setState({
      mobileMenuOpen: false,
    });
  }


  toggleMenu = () => {
    const { mobileMenuOpen } = this.state;
    this.setState({
      mobileMenuOpen: !mobileMenuOpen,
    });
  }


  setNoBackground = () => {
    const mainImage = document.getElementsByClassName(appBoundClassNames('main-image'));
    if (mainImage.length === 0) {
      this.setState({
        noBackground: false,
      });
      return;
    }

    this.setState({
      noBackground: mainImage[0].getBoundingClientRect().bottom > 55,
    });
  }


  render() {
    const { mobileMenuOpen, noBackground } = this.state;
    const { user } = this.props;

    return (
      <header>
        <div className={classNames('identity-bar')} />
        <div className={classNames('content', (mobileMenuOpen ? '' : 'menu-closed'), (noBackground && !mobileMenuOpen ? 'no-background' : ''))}>
          <div className={classNames('menu-icon-icon')} onClick={this.toggleMenu}>
            { mobileMenuOpen
              ? <i className={classNames('icon--header_menu_close')} />
              : <i className={classNames('icon--header_menu_list')} />
            }
          </div>
          <div className={classNames('content-left')}>
            <div className={classNames('logo')}>
              <span>
                <Link to="/">
                  <img src={logoImage} alt="OTL Logo" />
                </Link>
              </span>
            </div>
            <div className={classNames('menus')}>
              <span>
                <Link to="/dictionary">
                  과목사전
                </Link>
              </span>
              <span>
                <Link to="/timetable">
                  모의시간표
                </Link>
              </span>
            </div>
          </div>
          <div className={classNames('content-right')}>
            <div className={classNames('special-menus')}>
              {null}
            </div>
            <div className={classNames('common-menus')}>
              <span>
                <Link to=".">
                  <i className={classNames('icon--header_language')} />
                  <span>English</span>
                </Link>
              </span>
              <span>
                <Link to=".">
                  <i className={classNames('icon--header_notification')} />
                  <span>알림</span>
                </Link>
              </span>
              { user
                ? (
                  <Link to="/settings">
                    <i className={classNames('icon--header_user')} />
                    <span>
                      {user.lastName}
                      {user.firstName}
                    </span>
                  </Link>
                )
                : (
                  <a href={`/session/login/?next=${window.location.href}`}>
                    <i className={classNames('icon--header_user')} />
                    <span>
                      로그인
                    </span>
                  </a>
                )
              }
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.user,
});

const mapDispatchToProps = dispatch => ({
});

Header.propTypes = {
  user: userShape,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));