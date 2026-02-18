
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PageTitle from '../../components/PageTitle/PageTitle';
const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        margin: 0,
    },
    headerActions: {
        display: 'flex',
        gap: 12,
    },
    table: {
        margin: '24px auto',
        width: '100%',
        overflow: 'hidden',
        borderCollapse: 'separate',
    },
    thId: {
        width: 180,
    },
    itemImage: {
        width: 32,
        height: 32,
        borderRadius: 4,
        objectFit: 'cover',
        border: '1px solid #eee',
    },
    addressContainer: {
        display: 'flex',
        gap: 32,
        marginTop: 40,
        flexWrap: 'wrap',
    },
    addressBox: {
        flex: 1,
        position: 'relative',
    },
    addressHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 14,
    },
    addressTitle: {
        fontWeight: 600,
        fontSize: 18,
    },
    addressDetails: {
        color: '#333',
        lineHeight: 2,
        fontSize: 15,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    notProvided: {
        color: '#aaa',
    },
};

function NotProvided() {
    return <span style={styles.notProvided}>Not Provided</span>;
}

function AddressSection({ icon: Icon, title, address }) {
    return (
        <div className="news-item" style={styles.addressBox}>
            <div style={styles.addressHeader}>
                <Icon style={{ marginRight: 8 }} />
                <span style={styles.addressTitle}>{title}</span>
            </div>
            <div style={styles.addressDetails}>
                <div><b>Name:</b> {address?.name || <NotProvided />}</div>
                <div><b>Address:</b> {address?.address || <NotProvided />}</div>
                <div><b>City:</b> {address?.city || <NotProvided />}</div>
                <div><b>State:</b> {address?.state || <NotProvided />}</div>
                <div><b>ZIP:</b> {address?.zip || <NotProvided />}</div>
                <div><b>Country:</b> {address?.country || <NotProvided />}</div>
            </div>
        </div>
    );
}

function ItemsTable({ items }) {
    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, idx) => (
                    <tr key={idx}>
                        <td>{item.image ? <img src={item.image} alt={item.name} style={styles.itemImage} /> : <></>}</td>
                        <td>{item.productId?.productName || item.productName || ''}</td>
                        <td>{item.qty}</td>
                        <td>{item?.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


function OrderDetails({ order, onBack, onEditOrder }) {
    console.log("Order", order);
    if (!order) {
        return (
            <DashboardLayout>
                <div className="order-details-container">
                    <h2>Order Not Found</h2>
                    <Button onClick={onBack} variant="secondary">Back to Orders</Button>
                </div>
            </DashboardLayout>
        );
    }

    const isEditDisabled = order.status === 'Cancelled' || order.status === 'Completed';

    return (
        <DashboardLayout>
            <div className="order-details-container">
                <PageTitle
                    title="Order Details"
                    button={true}
                    buttonLabel="Edit Order"
                    onButtonClick={() => onEditOrder(order)}
                    backButton={true}
                    backButtonLabel="Back to Orders"
                    onBackButtonClick={onBack}
                />
                <table className="product-table news-item" style={styles.table}>
                    <tbody>
                        <tr>
                            <th style={styles.thId}>Order ID</th>
                            <td>{order._id}</td>
                        </tr>
                        <tr>
                            <th>User</th>
                            <td>
                                {order.user ? (
                                    <>
                                        <div><b>Name:</b> {order.user.userName || order.user.username || 'N/A'}</div>
                                        <div><b>Email:</b> {order.user.email || 'N/A'}</div>
                                    </>
                                ) : 'N/A'}
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{order.status}</td>
                        </tr>
                        <tr>
                            <th>Total</th>
                            <td>${order.totalAmount}</td>
                        </tr>
                        <tr>
                            <th>Created At</th>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th>Products</th>
                            <td>
                                <ItemsTable items={order.items} />
                            </td>
                        </tr>
                        {/* <tr>
                            <th>Shipping Address</th>
                            <td>{order.shippingAddress || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Billing Address</th>
                            <td>{order.billingAddress || 'N/A'}</td>
                        </tr> */}
                    </tbody>
                </table>
                    {/* Billing & Shipping Address */}
                <div style={styles.addressContainer}>
                    <AddressSection icon={HomeIcon} title="Billing Address" address={order.billingAddress} />
                    <AddressSection icon={LocalShippingIcon} title="Shipping Address" address={order.shippingAddress} />
                </div>
            </div>
        </DashboardLayout>
    );
}



export default OrderDetails;
