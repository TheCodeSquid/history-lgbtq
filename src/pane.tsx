import {createSignal, onCleanup, onMount, ParentComponent} from "solid-js";

import {useAppCtx} from "./main";

import styles from "./pane.module.css";

const SCROLL_MARGIN = 100;

export const Pane: ParentComponent<{
  index: number,
  imgUrl?: string,
  light?: boolean
}> = (props) => {
  const ctx = useAppCtx()!;
  const [scroll, setScroll] = createSignal(0);

  let elem: HTMLDivElement | undefined;

  const updateScroll = () => {
    const top = elem!.getBoundingClientRect().y;
    setScroll(top);

    if (ctx.pane() < props.index && top <= SCROLL_MARGIN)
      ctx.setPane(props.index);
    else if (ctx.pane() > props.index && top >= SCROLL_MARGIN - window.innerHeight)
      ctx.setPane(props.index);
  };

  onMount(() => {
    window.addEventListener("scroll", updateScroll);
    window.addEventListener("resize", updateScroll);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", updateScroll);
    window.removeEventListener("resize", updateScroll);
  });

  return <div class={styles.wrapper} ref={elem}>
    <div classList={{
      "panel": true,
      [styles.pane]: true,
      [styles.light]: props.light
    }} style={{
      "--offset": (scroll() / window.innerHeight) * 10 + "deg"
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
