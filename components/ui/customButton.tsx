"use client";
import React from 'react';
import styled from 'styled-components';

const Button = () => {
  return (
    <StyledWrapper>
      <button>
        <span>Log In</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    background: transparent;
    position: relative;
    padding: 3px 8px;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: 2px solid rgb(34 197 94);
    border-radius: 15px;
    outline: none;
    overflow: hidden;
    color: rgb(34 197 94);
    transition: color 0.3s ease-out;
    position: relative;
    overflow: hidden;
  }

  button span {
    margin: 5px;
    z-index: 2; /* Keep text above */
  }

  /* Fixing the background fill */
  button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(34 197 94);
    transform: scaleX(0); /* Start with no red fill */
    transform-origin: left;
    transition: transform 0.3s ease-out;
    z-index: 1; /* Place behind the text */
  }

  /* Hover effect */
  button:hover {
    color: #fff; /* Text becomes white */
  }

  button:hover::before {
    transform: scaleX(1); /* Expand the red fill */
  }
`;

export default Button;
