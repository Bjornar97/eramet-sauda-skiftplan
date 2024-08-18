import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import dayjs from "dayjs";
import nb from "dayjs/locale/nb";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import calendar from "dayjs/plugin/calendar";

dayjs.locale(nb);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);
dayjs.extend(updateLocale);

dayjs.updateLocale("nb", {
    calendar: {
        lastDay: "[i går]",
        sameDay: "[i dag]",
        nextDay: "[i morgen]",
        lastWeek: "[forrige] dddd",
        nextWeek: "dddd",
        sameElse: "dddd L",
    },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
