import React from 'react';
import renderer from 'react-test-renderer';
import { SourceToXML, XMLtoMMLTree } from '../parser';
import { MML } from './MML';
import { examples } from '../examples';

test('mml name and simple text field', () => {
  const mml = '<mml name="john">hi</mml>';
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  expect(tree.name).toEqual('john');
  expect(tree.children.length).toBe(1);
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});

test.only('mml with button', () => {
  const mml = `<mml name="support">
<text>It looks like your credit card isn't activated yet, activate it now:</text>
<button name="action" value="Activate">Activate Card</button>
</mml>`;
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  expect(tree.name).toEqual('support');
  expect(tree.children.length).toBe(2);
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});

test('simple carousel', () => {
  const mml = '<carousel><item>a</item><item>b</item></carousel>';
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});

test('simple input', () => {
  const mml = '<input name="name" value="John" />';
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  const state = tree.initialState();
  expect(state).toEqual({ name: 'John' });
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});

test('invalid input tag', () => {
  // note how name is missing
  const mml = '<input value="John" />';
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  const errors = tree.validateTree();
  expect(errors.length).toBe(1);
  expect(errors[0]).toEqual('Attribute name is required for tag input');
});

test('input tags should have data', () => {
  const mml = '<input name="myinput" value="1" />';
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  expect(tree.hasData()).toBe(true);
});

test('text tags should not have data', () => {
  const mml = '<text>hi</text>';
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  expect(tree.hasData()).toBe(false);
});

test('invalid MML 1', () => {
  const mml = '<input name="test" value=1 />';
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});

test('invalid MML 2', () => {
  const mml =
    '<image src="https://turn5.scene7.com/is/image/Turn5/J20850?wid=810&hei=608&op_usm=0.8,1,10,0&amp;test=test" />';
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});

test('examples should work', () => {
  for (const example of examples) {
    const rTree = renderer.create(<MML source={example.mml} />).toJSON();
    expect(rTree).toMatchSnapshot();
  }
});

test('only supported attributes are allowed', () => {
  const mml = '<mml name="john">hi</mml>';
  const nodes = SourceToXML(mml);
  const tree = XMLtoMMLTree(nodes);
  expect(tree.name).toEqual('john');
  expect(tree.children.length).toBe(1);
  const rTree = renderer.create(<MML source={mml} />).toJSON();
  expect(rTree).toMatchSnapshot();
});
