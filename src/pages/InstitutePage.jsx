    import { useEffect, useState } from 'react';
    import { collection, getDocs } from '../firebase';
    import InstitutionalProducts from '../components/InstitutionalProducts';

    function InstitutionalProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchInstitutionalProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'institutionalProducts'));
            const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            }));
            setProducts(productsData);
        } catch (err) {
            console.error('Error fetching institutional products:', err);
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
        };

        fetchInstitutionalProducts();
    }, []);

    if (loading) return <p>Loading Institutional Products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Institutional Products</h1>
        <InstitutionalProducts products={products} />
        </div>
    );
    }

    export default InstitutionalProductsPage;
