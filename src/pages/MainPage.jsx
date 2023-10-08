import axios from "axios";
import { useState, useRef } from "react";
import { Formik } from "formik";

import Spinner from "../components/Spinner/Spinner";

import { API_URL } from "../api/assistant";

const MainPage = () => {
  const myInterval = useRef(null)
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  const handleTaskStatus = (taskId) => {
    axios.get(`${API_URL}/v1/assistant/result/${taskId}`).then((res) => {
      if (res.data.status === "SUCCESS") {
        clearInterval(myInterval.current)
        setIsLoading(false);
        setAnswer(res.data.data);
        return res.data;
      }
    });
  };

  const handleSubmit = async (values) => {
    const payload = {
      api_token: values.apiKey,
      question: values.question,
    };
    const res = await axios.post(`${API_URL}/v1/assistant/ask`, payload);
    const taskId = res.data.task_id;
    setIsLoading(true);
    myInterval.current = setInterval(() => {handleTaskStatus(taskId)}, 1000);
  };

  return (
    <div>
      <h1>Assistant for X</h1>
      <h3>Ask me any question about X and I will help you with it!</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 10,
          rowGap: 10,
          alignItems: "center",
        }}
      >
        <div>
          {isLoading && <Spinner />}
          {answer && <p style={{fontSize: 20, color: "#"}}>{answer}</p>}
        </div>
        <Formik
          initialValues={{
            apiKey: "",
            question: "",
          }}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <>
              <input
                style={{
                  width: 500,
                  height: 30,
                  fontSize: 18,
                  textAlign: "center",
                }}
                type="password"
                placeholder="Fill in your API KEY here"
                value={formik.values.apiKey}
                onChange={formik.handleChange("apiKey")}
                required
              />
              <textarea
                name="question"
                cols="30"
                rows="10"
                value={formik.values.question}
                style={{
                  resize: "none",
                  fontSize: 18,
                  width: 500,
                }}
                onChange={formik.handleChange("question")}
                placeholder="Ask you question here..."
                required
              ></textarea>
              <button
                onClick={formik.handleSubmit}
                disabled={formik.isSubmitting}
                style={{
                  fontSize: 18,
                }}
              >
                Get Answer!
              </button>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MainPage;
