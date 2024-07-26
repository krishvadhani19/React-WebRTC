import { FormEvent, useCallback, useState } from "react";
import "./LobbyPage.scss";

const LobbyPage = () => {
  const [formData, setFormData] = useState({ email: "", roomCode: "" });

  const handleFormChange = useCallback((val: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  }, []);

  const handleFormSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="lobby-page-container">
      <form className="lobby-page-form" onSubmit={handleFormSubmit}>
        <div className="lobby-page-form-item">
          <label htmlFor="email">Email</label>

          <input
            type="email"
            id="email"
            value={formData?.email}
            placeholder="Enter email"
            onChange={(e: any) => handleFormChange(e?.target?.value, "email")}
            className="lobby-page-form-item-input"
          />
        </div>

        <div className="lobby-page-form-item">
          <label htmlFor="room">Room number</label>

          <input
            type="text"
            id="room"
            value={formData?.roomCode}
            placeholder="Enter room-code"
            onChange={(e: any) =>
              handleFormChange(e?.target?.value, "roomCode")
            }
            className="lobby-page-form-item-input"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LobbyPage;
