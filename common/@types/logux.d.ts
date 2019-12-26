declare module '@logux/redux/use-subscription' {
  import {SubscribeAction} from '@logux/core';

  interface Options {
    context?: object; //React.Context;
  }

  export default function useSubscription<A extends SubscribeAction>(
    channels: A['channel'][] | A[],
    opts?: Options,
  ): boolean;
}

declare module '@logux/core' {
  interface Action {
    type: string;

    [extraProps: string]: any;
  }

  interface SubscribeAction {
    //type: 'logux/subscribe'; //added by logux interna
    channel: string;

    [extraProps: string]: any;
  }

  interface Meta {

  }
}

declare module '@logux/server/context' {
  import {Action, Meta} from '@logux/core';

  interface Context {
    data: object;
    nodeId: string;
    userId?: string;
    clientId: string;
    isServer: boolean;
    subprotocol?: string;

    isSubprotocol(range: string): boolean;

    sendBack<A extends Action>(action: A, meta?: Meta): Promise<void>;
  }

  interface ChannelContext<Params extends object = {}> extends Context {
    params: Params;
  }
}

declare module '@logux/server/base-server' {
  import {Action, Meta, SubscribeAction} from '@logux/core';
  import {ChannelContext, Context} from '@logux/server/context';

  interface Client {
  }

  interface Authenticator {
    /**
     * @param userId User ID.
     * @param credentials The client credentials.
     * @param client Client object.
     * @return `true` if credentials was correct
     */
    (userId: string, credentials: any, client: Client): boolean | Promise<boolean>;
  }

  interface Authorizer<A extends Action> {
    /**
     * @param ctx Information about node, who create this action.
     * @param action The action data.
     * @param meta The action metadata.
     * @return `true` if client are allowed to use this action.
     */
    (ctx: Context, action: A, meta: Meta): boolean | Promise<boolean>;
  }

  interface ResendResponse {
    channel?: string;
    channels?: string[];
    client?: string;
    clients?: string[];
    user?: string;
    users?: string[];
    node?: string;
    nodes?: string[];
  }

  interface Resender<A extends Action> {
    /**
     * @param ctx Information about node, who create this action.
     * @param action The action data.
     * @param meta The action metadata.
     * @return Meta’s keys.
     */
    (ctx: Context, action: A, meta: Meta): ResendResponse | Promise<ResendResponse>;
  }

  interface Processor<A extends Action> {
    /**
     * @param ctx Information about node, who create this action.
     * @param action The action data.
     * @param meta The action metadata.
     * @return Promise when processing will be finished.
     */
    (ctx: Context, action: A, meta: Meta): void | Promise<void>;
  }

  interface Filter<ResendAction extends Action> {
    /**
     * @param ctx Information about node, who create this action.
     * @param resendAction The action data.
     * @param meta The action metadata.
     * @return Should action be sent to client.
     */
    (ctx: Context, resendAction: ResendAction, meta: Meta): boolean;
  }

  interface ChannelAuthorizer<SubAction extends SubscribeAction, Params extends object = {}> {
    /**
     * @param ctx Information about node, who create this action.
     * @param action The action data.
     * @param meta The action metadata.
     * @return `true` if client are allowed to subscribe to this channel.
     */
    (ctx: ChannelContext<Params>, action: SubAction, meta: Meta): boolean | Promise<boolean>;
  }

  interface FilterCreator<SubAction extends SubscribeAction, Params extends object = {}> {
    /**
     * @param ctx Information about node, who create this action.
     * @param action The action data.
     * @param meta The action metadata.
     * @return Actions filter.
     */
    (ctx: ChannelContext<Params>, action: SubAction, meta: Meta): void | Filter;
  }

  interface Initialized<SubAction extends SubscribeAction, Params extends object = {}> {
    /**
     * @param ctx Information about node, who create this action.
     * @param action The action data.
     * @param meta The action metadata.
     * @return Promise during initial actions loading.
     */
    (ctx: ChannelContext<Params>, action: SubAction, meta: Meta): void | Promise<void>;
  }

  interface ChannelCallbacks<SubAction extends SubscribeAction, Params extends object = {}> {
    access: ChannelAuthorizer<SubAction, Params>;
    filter?: FilterCreator<SubAction, Params>;
    init?: Initialized<SubAction, Params>;
    finally?: () => void;
  }

  interface TypeCallbacks<A extends Action> {
    access: Authorizer<A>;
    resend?: Resender<A>;
    process?: Processor<A>;
    finally?: () => void;
  }

  export default class BaseServer {
    constructor(options: object);

    auth(authenticator: Authenticator): void;

    listen(): Promise<void>;

    channel<A extends SubscribeAction, Params extends object = {}>(
      pattern: A['channel'] | RegExp,
      callbacks: ChannelCallbacks<A, Params>,
    ): void;

    otherChannel(callbacks: ChannelCallbacks): void;

    undo(meta: Meta, reason?: string, extra?: object): Promise<void>;

    type<A extends Action>(name: A['type'], callbacks: TypeCallbacks<A>): void;
  }

}

declare module '@logux/server/server' {

  import BaseServer from '@logux/server/base-server';

  interface ServerOptions {
    subprotocol?: string;
    supports?: string;
    timeout?: number;
    ping?: number;
    root?: string;
    store?: object;
    server?: object;
    port?: number;
    host?: string;
    key?: string;
    cert?: string;
    env?: "production" | "development";
    bunyan?: string;
    reporter?: () => void;
    backend?: string;
    controlHost?: string;
    controlPort?: number;
    controlPassword?: string;
    redis?: string;
  }

  export default class Server extends BaseServer {
    constructor(options: ServerOptions);

    static loadOptions(process: NodeJS.Process, defaults?: object): ServerOptions;
  }
}

declare module '@logux/server/allowed-meta' {
  type ALLOWED_META = ['id', 'time', 'subprotocol'];
  export default ALLOWED_META;
}

declare module '@logux/server' {
  export {default as ALLOWED_META} from '@logux/server/allowed-meta';
  export {default as BaseServer} from '@logux/server/base-server';
  export {default as Server} from '@logux/server/server';
}
