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

export const AImg: Component<{
  text: string,
  href: string,
  imgSrc: string,
  imgAlt: string
}> = (props) => (
  <a href={props.href} class={styles.aImg}>
    <p>{props.text}</p>
    <img src={props.imgSrc} alt={props.imgAlt}/>
  </a>
)
