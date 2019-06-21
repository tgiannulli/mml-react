import React from "react";
import parseXml from "@rgrove/parse-xml";
import { getMMLTags } from "./tags";
import { MMLTree } from "./tree";

/**
 * ParseMMLSource - Takes an MML string and converts it to XML nodes
 *
 * @param {type} source MML tag string
 *
 * @returns {array} an Array of XML nodes
 */
export function ParseMMLSource(source) {
  // the wrapping MML tags are optional, for parsing simplicity we automatically add them if they are not already there
  if (!~source.indexOf("<mml")) {
    source = `<mml>${source}</mml>`;
  }

  // convert the string to XML nodes
  // this library is relatively lightweight and doesn't do a ton of validation
  const XMLNodes = [parseXml(source)];
  return XMLNodes;
}

/**
 * XMLtoMMLTree - Takes an array of XML nodes and converts it into an MML Tree
 *
 * @param {type} XMLNodes an array of XML nodes
 *
 * @returns {MMLTree} The MML tree
 */
export function XMLtoMMLTree(XMLNodes) {
  const tags = getMMLTags();

  let tree;

  function convertNodes(nodes) {
    const MMLNodes = [];
    for (let n of nodes) {
      let children;
      if (n.children) {
        children = convertNodes(n.children);
      }

      // structured way of looking up mml tags...
      let tagName = n.name;
      if (n.name === "mml") {
        tree = new MMLTree(n, children);
        continue;
      }
      // skip the document level element...
      if (n.type === "document") {
        return children;
      }
      if (n.type === "text") {
        if (n.text.trim().length > 0) {
          tagName = "text";
        } else {
          // skip empty text nodes
          continue;
        }
      }

      const tagMeta = tags[tagName];
      if (tagMeta) {
        const reactNode = new tagMeta.constructor(tagName, n, children);
        MMLNodes.push(reactNode);
      } else {
        console.log("unrecognized element", tagName);
      }
    }
    return MMLNodes;
  }
  convertNodes(XMLNodes);

  return tree;
}
