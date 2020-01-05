import React, {ReactElement} from 'react';
import {Divider, Grid, Segment} from 'semantic-ui-react';

export default function (): ReactElement {
  return <section>
    <Segment vertical>
      <Grid columns={2} relaxed='very'>
        <Grid.Column>
          xxx
        </Grid.Column>
        <Grid.Column>
          yyy
        </Grid.Column>
      </Grid>
      <Divider vertical>VS</Divider>
    </Segment>
  </section>;
}
