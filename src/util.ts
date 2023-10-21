import {Accessor, createMemo, createSignal, onCleanup, onMount} from "solid-js";

const FPS = 60;
export const MPF = (1 / FPS) * 1000;

const TWEEN = 0.1;

export const elemTop = (elem: () => Element | undefined): Accessor<number> => {
  const [top, setTop] = createSignal(0);

  const update = () => {
    const e = elem();
    if (e)
      setTop(top() + (e.getBoundingClientRect().top / window.innerHeight - top()) * TWEEN);
  };
  let handle: number;
  onMount(() => {
    handle = setInterval(update, MPF);
    // addEventListener("scroll", update);
    // addEventListener("resize", update);
  });
  onCleanup(() => {
    clearInterval(handle);
    // removeEventListener("scroll", update);
    // removeEventListener("resize", update);
  });

  return top;
};

const bodyTop = elemTop(() => document.body);
export const scroll = createMemo(() => -bodyTop());
