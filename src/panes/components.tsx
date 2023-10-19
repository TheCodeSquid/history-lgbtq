import {ParentComponent, Component} from "solid-js";

import styles from "./components.module.css";

export const Flex: ParentComponent = (props) => (
  <div class={styles.flex}>{props.children}</div>
);

export const Grow: ParentComponent = (props) => (
  <div class={styles.grow}>{props.children}</div>
);

export const Line: Component = () => (
  <div class={styles.line} />
);