import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/Button/Button';
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
};

function ProductDetails({ product, onBack, onEditProduct }) {
  if (!product) {
    return (
      <DashboardLayout>
        <div className="order-details-container">
          <h2>Product Not Found</h2>
          <Button onClick={onBack} variant="secondary">Back to Products</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="order-details-container">
         <PageTitle
          title="Product Details"
          button={true}
          buttonLabel="Edit Product"
          onButtonClick={() => onEditProduct(product.id)}
          backButton={true}
          backButtonLabel="Back to Products"
          onBackButtonClick={onBack}
        />
        <table className="product-table news-item" style={styles.table}>
          <tbody>
            <tr>
              <th style={styles.thId}>Product ID</th>
              <td>{product.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{product.name}</td>
            </tr>
            <tr>
              <th>SKU</th>
              <td>{product.sku}</td>
            </tr>
            <tr>
              <th>Images</th>
              <td>
                {Array.isArray(product.images) && product.images.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Product ${product.name} ${idx + 1}`}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee' }}
                      />
                    ))}
                  </div>
                ) : (
                  <span style={{ color: '#aaa' }}>No images</span>
                )}
              </td>
            </tr>
            <tr>
              <th>Price</th>
              <td>${product.price}</td>
            </tr>
            <tr>
              <th>Qty</th>
              <td>{product.qty}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{product.description}</td>
            </tr>
            <tr>
              <th>Created At</th>
              <td>{product.createdAt}</td>
            </tr>
            <tr>
              <th>Updated At</th>
              <td>{product.updatedAt}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default ProductDetails;
