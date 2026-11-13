import { StoreProvider, useStore } from "./lib/store";
import { Rail, Topbar, Toast } from "./components/Shell";
import { SkillDrawer } from "./components/SkillDrawer";
import { Overview } from "./views/Overview";
import { Library } from "./views/Library";
import { Skills } from "./views/Skills";
import { Features } from "./views/Features";
import { Quality } from "./views/Quality";
import { Board } from "./views/Board";
import { Settings } from "./views/Settings";

const VIEWS = {
  overview: Overview,
  library: Library,
  skills: Skills,
  features: Features,
  quality: Quality,
  board: Board,
  settings: Settings,
};

export function App() {
  const { view, collapsed, density } = useStore();
  const View = VIEWS[view];
  return (
    <div className="app" data-collapsed={collapsed} data-density={density}>
      <Rail />
      <div className="main">
        <Topbar />
        <main key={view}>
          <View />
        </main>
      </div>
      <SkillDrawer />
      <Toast />
    </div>
  );
}
