/*
 * <license header>
 */

import React, { useState, useEffect } from "react";
import actionWebInvoke from '../utils';
import allActions from '../config.json';
import { attach } from "@adobe/uix-guest";
import {
  Flex,
  Provider,
  Content,
  defaultTheme,
  Text,
  TableView,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  Image
} from "@adobe/react-spectrum";

import { extensionId } from "./Constants";

export default function () {
  const [guestConnection, setGuestConnection] = useState();
  const [selectedKeys, setSelectedKeys] = useState();

  useEffect(() => {
    (async () => {
      const guestConnection = await attach({ id: extensionId });

      setGuestConnection(guestConnection);
    })();
  }, []);

  const onCloseHandler = () => {
    guestConnection.host.modal.close();
  };

  // const books = 'https://main--demo-boilerplate--lamontacrook.hlx.page/audible/books.json';
  // fetch(books, {
  //   method: 'get',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   }
  // }).then((res) => {
  //   if(res) {
  //     res.json().then((content) => {
  //       console.log(content.data);
  //       const c = Object.keys(content.data[0]).map((key) => {
  //         return {name: key, uid: key.toLowerCase()};
  //       });
  //       console.log(c);
  //     })
  //   }
  // });

  let columns = [
    { name: 'Title', uid: 'title' },
    { name: 'Author', uid: 'author' },
    { name: 'Performer', uid: 'performer' },
    { name: 'Image', uid: 'image' },
  ];

  let rows = [
    {
      id: '1524779261',
      title: 'Atomic Habits',
      author: 'James Clear',
      performer: 'James Clear',
      image: 'https://author-p101152-e938206.adobeaemcloud.com/adobe/dynamicmedia/deliver/dm-aid--7876b1e6-91e3-49d5-a3b9-33050b39fcb2/_1F47rk2eL__SL3840_.png?preferwebp=true'
    },
    {
      id: 'Z7EG8cdHtfFjuvlR',
      title: "The History of the Ancient World",
      author: "Susan Wise Bauer",
      performer: "John Lee",
      image: "https://main--demo-boilerplate--lamontacrook.hlx.page/audible/514brhmednl-sl500.jpg",
    },
    {
      id: 'B0038U1116',
      title: "The Decline and Fall of the Roman Empire",
      author: "Edward Gibbon",
      performer: "Charlton Griffin",
      length: "126 hrs and 31 mins",
      description: "$14.95 a month after 30 days. Cancel anytime.",
      image: "https://main--demo-boilerplate--lamontacrook.hlx.page/audible/51ivrqhvcsl-sl500.jpg",
    },
    {
      id: 'yhsIwI1QnfntIwxZ',
      title: "Napoleon",
      author: "Andrew Roberts",
      performer: "John Lee",
      length: "32 hrs and 56 mins",
      description: "$14.95 a month after 30 days. Cancel anytime.",
      image: "https://main--demo-boilerplate--lamontacrook.hlx.page/audible/61zqtvvogvl-sl500.jpg",
    },
    {
      id: 'B004VA8ZVQ',
      title: "Benjamin Franklin: An American Life",
      author: "Walter Isaacson",
      performer: "Nelson Runger",
      length: "24 hrs and 40 mins",
      description: "$14.95 a month after 30 days. Cancel anytime.",
      image: "https://main--demo-boilerplate--lamontacrook.hlx.page/audible/61zcpkitwzl-sl500.jpg",
    }
  ];

  if (selectedKeys && Object.values(selectedKeys)) {
    addSku(guestConnection, Object.values(selectedKeys).pop())
  }

  return (
    <Provider theme={defaultTheme} colorScheme='light'>
      <Content width="100%">
        <Text>Your modal content for "Select Book"</Text>

        <TableView
          selectedKeys={selectedKeys}
          onSelectionChange={(e) => setSelectedKeys(e)}
          aria-label="Example table with dynamic content"
          maxWidth="size-8000" selectionMode="single">
          <TableHeader columns={columns}>
            {column => (
              <Column
                key={column.uid}
                align={column.uid === 'date' ? 'end' : 'start'}>
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {item => (
              <Row style='height:140px' key={item['id']}>
                {columnKey => columnKey === 'image' ? <Cell><Image height='30px' width='30px' src={item[columnKey]} /></Cell> : <Cell>{item[columnKey]}</Cell>}
              </Row>
            )}
          </TableBody>
        </TableView>
      </Content>
    </Provider>
  );

  async function addSku(conn, sku) {
    conn.host.modal.set({ loading: true });
    const headers = {
      'Authorization': 'Bearer ' + guestConnection.sharedContext.get('auth').imsToken,
      'x-gw-ims-org-id': guestConnection.sharedContext.get('auth').imsOrg
    };

    const { model, path } = await guestConnection.host.contentFragment.getContentFragment();
   
    const params = {
      aemHost: `https://${guestConnection.sharedContext.get('aemHost')}`,
      sku: sku,
      modelPath: model.path,
      fragmentPath: path.replace('/content/dam', '/api/assets')
    };

    const action = 'add-sku';

    try {
      const actionResponse = await actionWebInvoke(allActions[action], headers, params);
      console.log(`Response from ${action}:`, actionResponse);
      onCloseHandler();
    } catch (e) {
      console.error(e)
    }
  }
}
