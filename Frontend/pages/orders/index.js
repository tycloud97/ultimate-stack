const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {


  let urlvl = "/api/orders";

  const { data } = await client.get(urlvl);

  return { orders: data };
};

export default OrderIndex;
