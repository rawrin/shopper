import React from 'react';
import ReactDom from 'react-dom';
import AppContainer from './AppContainer';

let data;
try {
  data = JSON.parse(document.getElementById('data').innerHTML);
} catch(err) {
  console.log('Error :(');
  data = {}
}

ReactDom.render(
  <AppContainer data={data} />,
  document.getElementById('app')
);
