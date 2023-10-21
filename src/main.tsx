import {Component, createMemo, For, JSXElement} from "solid-js";
import {render} from "solid-js/web";

import "./global.css";
import styles from "./main.module.css";
import {Pane} from "./pane";
import {scroll} from "./util";
import {Background} from "./background";

import Intro from "./panes/intro.mdx";
import Threats from "./panes/threats.mdx";
import Groups from "./panes/groups.mdx";
import Support from "./panes/support.mdx";

const Landing: Component = () => (
  <div class={styles.landing}>
    <h1>The Legal Attack on LGBTQ+ Rights</h1>
    <sub>Made by <a href="https://github.com/TheCodeSquid">Diego</a></sub>
  </div>
);

const App: Component = () => {
  const panes: [JSXElement, string?, boolean?][] = [
    [<Landing/>, undefined, true],
    [<Intro/>, "https://upload.wikimedia.org/wikipedia/commons/0/07/Dublin_Trans_Pride_2018_11.jpg"],
    [<Threats/>, "https://images.unsplash.com/photo-1589578527966-fdac0f44566c"],
    [<Groups/>],
    [<Support/>, "https://images.unsplash.com/photo-1594850598343-a5b0a83c237d"]
  ];

  const pane = createMemo(() => Math.round(scroll()));

  const scrollToPane = (i: number) => {
    window.scrollTo({
      top: i * window.innerHeight
    });
  };

  return <>
    <Background/>

    <div class={styles.page}>
      <div class={styles.navWrap}>
        <nav classList={{
          "panel": true,
          [styles.top]: pane() === 0
        }}>
          <For each={Array.from(panes.keys())}>
            {i => <button
              classList={{[styles.on]: pane() === i}}
              onclick={() => {
                scrollToPane(i);
              }}
            >
              <div/>
            </button>}
          </For>
        </nav>
      </div>

      <div class={styles.panes}>
        <For each={Array.from(panes.entries())}>
          {([i, [content, imgUrl, light]]) => <div>
            <Pane index={i} imgUrl={imgUrl} light={light}>
              {content}
            </Pane>
          </div>}
        </For>
      </div>
    </div>
  </>;
};

const root = document.getElementById("root")!;
render(() => <App/>, root);
