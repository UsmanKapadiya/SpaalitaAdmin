// CategoryPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { getCategorys, deleteCategory } from '../../services/categoryServices';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PageTitle from '../../components/PageTitle/PageTitle';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import './Category.css'
import GlobalLoader from '../../components/Loader/GlobalLoader';
import EmptyState from '../../components/EmptyState/EmptyState';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../../components/SearchAndFilter/SearchAndFilter';
import Pagination from '../../components/Pagination/Pagination';


const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, itemId: null, itemName: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
    const token = sessionStorage.getItem('authToken')?.replace(/^"|"$/g, '');
    const [error] = useState(null);

    const fetchCategories = async (pageNum = page, search = searchTerm) => {
        setLoading(true);
        try {
            const resp = await getCategorys(pageNum, itemsPerPage, search);
            if (resp && resp.success === true) {
                setCategories(resp?.data);
            }
            if (resp && resp.pagination) {
                setPagination(resp.pagination);
                setPage(resp.pagination.page);
                setItemsPerPage(resp.pagination.limit);
            }
        } catch (err) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchCategories(page, searchTerm);
    }, [page, searchTerm]);

    // Delete category
    const handleDelete = useCallback((cat) => {
        setConfirmDialog({
            isOpen: true,
            itemId: cat._id,
            itemName: cat.name
        });
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!confirmDialog.itemId) return;
        try {
            await deleteCategory(confirmDialog.itemId, token);
            toast.success('Category deleted successfully!');
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
            fetchCategories();
        } catch (err) {
            toast.error('Failed to delete category');
            setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
        }
    }, [confirmDialog.itemId]);

    const closeConfirmDialog = useCallback(() => {
        setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }, []);


    const flattenCategories = (categories, parentName = null, depth = 0) => {
        let result = [];

        categories.forEach(cat => {
            result.push({
                ...cat,
                parentName,
                depth, // store depth for indentation
            });

            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children, cat.name, depth + 1));
            }
        });

        return result;
    };

    const tableData = flattenCategories(categories);
    const totalPages = pagination.pages;

    return (
        <DashboardLayout>
            <div className="category-table-page">
                <PageTitle
                    title="Categories"
                    subTitle="Manage your product categories"
                    button={true}
                    buttonLabel="Add Category"
                    onButtonClick={() => navigate(`/category/edit/new`, {
                        state: {
                            allCategoryData: tableData,
                        },
                    })}
                />
                <div className="search-bar">
                    <SearchAndFilter
                        searchValue={searchTerm}
                        onSearchChange={value => {
                            setSearchTerm(value);
                            setPage(1);
                        }}
                        showFilter={false}
                        placeholder="Search products by Name or SKU..."
                    />
                </div>
                <div className="category-table-wrapper">
                    {loading ? (
                        <GlobalLoader text="Loading categories..." />
                    ) : tableData.length === 0 ? (
                        <EmptyState
                            icon={<CategoryIcon style={{ fontSize: 48 }} />}
                            title="No Categories Found"
                            description="No categories yet"
                        />
                    ) : (
                        // <Table
                        //     tableClassName="category-table"
                        //     columns={[
                        //         {
                        //             key: 'name',
                        //             label: 'Name',
                        //             render: (value, item) =>
                        //                 item.parentName ? (
                        //                     <span className="parent-indent">{value}</span>
                        //                 ) : (
                        //                     value
                        //                 ),
                        //         },
                        //         { key: 'slug', label: 'Slug' },
                        //         { key: 'parentName', label: 'Parent' },
                        //         {
                        //             key: 'count',
                        //             label: 'Products',
                        //             render: (value) => value || 0,
                        //         },
                        //         {
                        //             key: 'actions',
                        //             label: 'Actions',
                        //             render: (value, item) => (
                        //                 <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                        //                     <Button
                        //                         className="btn-icon edit"
                        //                         onClick={() =>
                        //                             navigate(`/category/edit/${item._id}`, {
                        //                                 state: {
                        //                                     allCategoryData: tableData
                        //                                 }
                        //                             })
                        //                         }
                        //                     >
                        //                         <EditIcon />
                        //                     </Button>
                        //                     <Button
                        //                         className="btn-icon delete"
                        //                         onClick={() => handleDelete(item)}
                        //                     >
                        //                         <DeleteIcon />
                        //                     </Button>
                        //                 </div>
                        //             ),
                        //         },
                        //     ]}
                        //     data={tableData}
                        // />
                        <Table
                            tableClassName="category-table"
                            columns={[
                                {
                                    key: 'name',
                                    label: 'Name',
                                    render: (value, item) => (
                                        <span style={{ paddingLeft: `${item.depth * 20}px` }}>
                                            {value}
                                        </span>
                                    ),
                                },
                                { key: 'slug', label: 'Slug' },
                                { key: 'parentName', label: 'Parent' },
                                {
                                    key: 'count',
                                    label: 'Products',
                                    render: (value) => value || 0,
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (value, item) => (
                                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                                            <Button
                                                className="btn-icon edit"
                                                onClick={() =>
                                                    navigate(`/category/edit/${item._id}`, {
                                                        state: {
                                                            allCategoryData: tableData,
                                                        },
                                                    })
                                                }
                                            >
                                                <EditIcon />
                                            </Button>
                                            <Button
                                                className="btn-icon delete"
                                                onClick={() => handleDelete(item)}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={tableData}
                        />
                    )}
                </div>

                {totalPages > 1 && !loading && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                        showInfo={true}
                        showJumper={totalPages > 10}
                    />
                )}

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={closeConfirmDialog}
                    onConfirm={confirmDelete}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                />
            </div>
        </DashboardLayout>
    );
};

export default Category;