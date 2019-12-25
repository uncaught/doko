import {Filter} from "@logux/server/base-server";
import {Action, Meta} from "@logux/core";
import {Context} from "@logux/server/context";

export function createFilter() {
  const map = new Map<string, Filter<Action>>();

  const addFilter = <A extends Action>(type: A['type'], filter: Filter<A>) => {
    // @ts-ignore
    map.set(type, filter);
  };

  const combinedFilter = (resendCtx: Context<Action>, resendAction: Action, resendMeta: Meta) => {
    const filter = map.get(resendAction.type);
    if (filter) {
      return filter(resendCtx, resendAction, resendMeta);
    }
    return true;
  };

  return {addFilter, combinedFilter};
}
