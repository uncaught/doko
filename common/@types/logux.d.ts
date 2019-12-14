declare module '@logux/redux/use-subscription' {

  interface Subscribe {
    channel: string;
  }

  type Channel = string | Subscribe;

  interface Options {
    context?: object; //React.Context;
  }

  export default function useSubscription(channels: Channel[], opts?: Options): boolean;
}
