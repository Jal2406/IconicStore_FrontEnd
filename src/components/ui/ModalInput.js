import { Form } from "react-bootstrap"

export const EditInputs = ({label, placeholder, type, value, onChange, name}) =>{
    return(
    <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type={type}
              placeholder={placeholder}
              name={name}
              value={value}
              onChange={onChange}
            />
    </Form.Group>

    )
}