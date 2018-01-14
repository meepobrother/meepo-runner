# runner header

```ts
export const runnerHeaderRoom = 'runnerHeaderRoom';
export const RUNNER_HEADER_INIT = 'RUNNER_HEADER_INIT';
export const RUNNER_HEADER_CLICK_RIGHT = 'RUNNER_HEADER_CLICK_RIGHT';
export const RUNNER_HEADER_CLICK_LEFT = 'RUNNER_HEADER_CLICK_LEFT';
export const RUNNER_HEADER_CLICK_NAV_ITEM = 'RUNNER_HEADER_CLICK_NAV_ITEM';
export const RUNNER_HEADER_CLICK_HEADER_ITEM = 'RUNNER_HEADER_CLICK_HEADER_ITEM';

```

- **runnerHeaderRoom** 房间号

- 案例
```ts
let url = this.core.murl('entry//open', { __do: 'v2setting.tasksClass', m: 'imeepos_runner' }, false);
this.axios.bpost(url, {}).subscribe((res: ReturnWidget) => {
    this.items = res.info;
    let hasActive = false;
    this.items.map(item => {
        if (item.active) {
            this.setActive(item);
            hasActive = true;
        }
        item.value = item.code;
    });
    if (!hasActive) {
        if (this.items && this.items.length > 0) {
            this.setActive(this.items[0]);
        }
    }
    this.event.emit(runnerHeaderRoom,{
        type: RUNNER_HEADER_INIT,
        data: this.items
    });
});
```