"use client";
import { TypeAnimation } from "react-type-animation";
import GraphemeSplitter from 'grapheme-splitter';

const AnimatedText: React.FC = () => {
    const splitter = new GraphemeSplitter();
  return (
    <TypeAnimation
    splitter={(str) => splitter.splitGraphemes(str)}
    sequence={[
      'Let\'s grow together 🤑',
      2000,
      'Manage your finance seamlessly 💯',
      2000,
      'Protect your personal data 🛡️',
      2000,
      'Welcome to WealthWise Hub 🚀',
      2000,
      'Your financial freedom starts here 🌟',
      2000,
    ]}
      style={{ fontSize: "1.5em", color: "white"}}
      repeat={Infinity}
    />
  );
};

export default AnimatedText;
