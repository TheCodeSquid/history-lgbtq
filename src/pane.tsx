import {ParentComponent} from "solid-js";

import {elemTop} from "./util";

import styles from "./pane.module.css";

export const Pane: ParentComponent<{
  index: number,
  imgUrl?: string,
  light?: boolean
}> = (props) => {
  let elem: HTMLDivElement | undefined = undefined;
  const top = elemTop(() => elem);

  return <div class={styles.wrapper} ref={elem}>
    <div classList={{
      "panel": true,
      [styles.pane]: true,
      [styles.light]: props.light
    }} style={{
      "--offset": top() * 10 + "deg"
    }}>
      <div classList={{
        [styles.bg]: true,
        [styles.hidden]: props.imgUrl === undefined
      }} style={{
        "--img-url": `url("${props.imgUrl}")`
      }}/>
      {props.children}
    </div>
  </div>;
};
