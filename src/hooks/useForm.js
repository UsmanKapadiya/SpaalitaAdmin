import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * useForm - A reusable form hook for CRUD forms with image and description support.
 * @param {object} options
 *   - initialForm: initial form state object
 *   - data: array of items (for edit mode lookup)
 *   - id: current id (from params)
 *   - isEdit: boolean
 *   - fields: array of required field names (for validation)
 *   - onSubmit: function to call with form data
 *   - imageField: string (optional, e.g. 'image')
 *   - descriptionField: string (optional, e.g. 'description')
 */
export default function useForm({
  initialForm,
  data,
  id,
  isEdit,
  fields,
  onSubmit,
  imageField = 'image',
  descriptionField = 'description',
}) {
  const [form, setForm] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit && data) {
      const item = data.find(g => g.id === id);
      if (item) {
        setForm({
          ...item,
          ...(item.value !== undefined ? { value: String(item.value) } : {}),
          ...(item.qty !== undefined ? { qty: String(item.qty) } : {}),
        });
        if (item[imageField]) setImagePreview(item[imageField]);
      }
    }
    // eslint-disable-next-line
  }, [id, isEdit, data]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setError('');
    setSuccess('');
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, [imageField]: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setError('');
    setSuccess('');
  };

  const handleDescriptionChange = useCallback((value) => {
    setForm(f => ({ ...f, [descriptionField]: value }));
    setError('');
    setSuccess('');
  }, [descriptionField]);

  const validate = () => {
    for (let field of fields) {
      if (!form[field]) {
        const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);
        setError(`Please fill the required field: ${fieldLabel}`);
        toast.error(`Please fill the required field: ${fieldLabel}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (!validate()) {
      console.log("validation Faild")
      setLoading(false);
      return;
    }
    await onSubmit(form, { setError, setSuccess, setLoading });
    setLoading(false);
  };

  return {
    form,
    setForm,
    imagePreview,
    setImagePreview,
    loading,
    error,
    success,
    handleChange,
    handleImageChange,
    handleDescriptionChange,
    handleSubmit,
    setError,
    setSuccess,
  };
}
