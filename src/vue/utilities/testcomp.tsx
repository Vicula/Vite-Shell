import { App, defineComponent } from "vue";

export default {
  install: (app: App): void => {
    app.component(
      "TESTCOMP",
      defineComponent({
        render() {
          return <div>test</div>;
        },
      })
    );
  },
};
