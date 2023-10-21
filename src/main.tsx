import {Accessor, Component, createContext, createSignal, For, JSXElement, Setter, useContext} from "solid-js";
import {render} from "solid-js/web";

import "./global.css";
import styles from "./main.module.css";
import {Pane} from "./pane";
import {Background} from "./background";

import Intro from "./panes/intro.mdx";
import Threats from "./panes/threats.mdx";
import Groups from "./panes/groups.mdx";
import Support from "./panes/support.mdx";

const AppCtx = createContext<{
  pane: Accessor<number>,
  setPane: Setter<number>
}>();

export const useAppCtx = () => useContext(AppCtx);

const Landing: Component = () => (
  <div class={styles.landing}>
    <h1>The Legal Attack on LGBTQ+ Rights</h1>
    <sub>Made with 💜 by Diego</sub>
  </div>
);

const App: Component = () => {
  const [pane, setPane] = createSignal(0);

  const ctx = {pane, setPane};

  const scrollToPane = () => {
    window.scrollTo({
      top: pane() * window.innerHeight
    });
  };

  const panes: (JSXElement | ["transparent", JSXElement])[] = [
    ["transparent", <Landing/>],
    <Intro/>,
    <Threats/>,
    <Groups/>,
    <Support/>
  ];

  return <AppCtx.Provider value={ctx}>
    <Background/>

    <div class={styles.page}>
      <div class={styles.navWrap}>
        <nav classList={{
          "panel": true,
          [styles.top]: pane() === 0
        }}>
          <For each={Array.from(panes.keys())}>
            {i => <button
              classList={{[styles.on]: ctx.pane() === i}}
              onclick={() => {
                setPane(i);
                scrollToPane();
              }}
            >
              <div/>
            </button>}
          </For>
        </nav>
      </div>

      <div class={styles.panes}>
        <For each={Array.from(panes.entries())}>
          {([i, pane]) => <div>
            {Array.isArray(pane) ? <Pane transparent index={i}>{pane[1]}</Pane> :
              <Pane index={i}>
                {pane}
              </Pane>}
          </div>}
        </For>
      </div>
    </div>
  </AppCtx.Provider>;
};

const root = document.getElementById("root")!;
render(() => <App/>, root);
