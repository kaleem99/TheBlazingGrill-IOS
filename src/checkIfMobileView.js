import React from "react";
import App from "./App";

class MobileDetector extends React.Component {
  constructor() {
    super();
    this.state = {
      isMobile: false,
    };
  }

  componentDidMount() {
    this.checkIfMobile();
    window.addEventListener("resize", this.checkIfMobile);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkIfMobile);
  }

  checkIfMobile = () => {
    const isMobile = window.innerWidth < 768; // Adjust the threshold as needed
    this.setState({ isMobile });
  };

  render() {
    const { isMobile } = this.state;

    return (
      <div>
        {isMobile ? <App /> : <p>Please ensure to only use a mobile device</p>}
      </div>
    );
  }
}

export default MobileDetector;
