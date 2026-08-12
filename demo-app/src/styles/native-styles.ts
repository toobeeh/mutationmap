import {css} from "lit";

export const nativeStyles = css`
  code {
    font-family: var(--mono);
    font-size: 1em;
    line-height: 1.5em;
    display: inline-flex;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--text-h);
    background: var(--code-bg);
  }

  hr {
    opacity: .2;
    margin: 1rem 0;
    width: 90%;
  }

  input[type=text] {
    font-size: 1em;
    line-height: 1.5em;
    display: inline-flex;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--text-h);
    background: var(--code-bg);
    border:none;
    outline:none;
  }

  button {
    font-family: var(--mono);
    font-size: 1em;
    display: inline-flex;
    padding: 5px 10px;
    border-radius: 5px;
    color: var(--accent);
    background: var(--accent-bg);
    border: 2px solid transparent;
    transition: border-color 0.3s;
    cursor: pointer;
  }

  button:hover {
    border-color: var(--accent-border);
  }

  button:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  small {
    font-size: 0.8em;
    opacity: .5;
  }
`;
