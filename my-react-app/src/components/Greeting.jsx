import React from "react";

function Greeting({ props }) {
  return (
    <div>
      <h1>Hello, {props}!</h1>
      <p>Welcome to our payment system.</p>
    </div>
  );
}

export default  Greeting;