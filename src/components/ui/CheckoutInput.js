const CheckoutInput = ({lable, placeholder, onChange, value, required = false}) =>{
    return(<>
        <label className="form-label fw-semibold">{lable}<span className="text-danger">*</span></label>
        <input
            className="form-control rounded-3 shadow-sm"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required = {required}
         />
        </>
    )
}

export default CheckoutInput;