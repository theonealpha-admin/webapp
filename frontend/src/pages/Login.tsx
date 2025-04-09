import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AUTH_TOKEN } from "@/constants/auth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      window.location.href = "/dashboard";
    }
  }, []);

  // Define the validation schema
  // const validationSchema = Yup.object().shape({
  //   email: Yup.string()
  //     .email("Invalid email address")
  //     .required("Email is required"),
  //   password: Yup.string()
  //     .required("Password is required")
  //     .min(2, "Password must be at least 2 characters"),
  // });

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Username is required")
      .test(
        "is-valid-email-or-username",
        "Invalid email address",
        (value) => {
          if (!value) return false;
          // If the value contains an '@', validate it as an email address.
          if (value.includes("@")) {
            return Yup.string().email().isValidSync(value);
          }
          // Otherwise, treat it as a username and accept it.
          return true;
        }
      ),
    password: Yup.string()
      .required("Password is required")
      .min(2, "Password must be at least 2 characters"),
  });


  // Define the initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    // Here you would typically handle the login logic
    try {
      setIsLoading(true);
      const { email, password } = values;
      await login(email, password);
      toast({
        title: "Login Successful",
        description: "You have successfully logged in",
        duration: 1500,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description:
          "Failed to log in. Please check your credentials and try again.",
        duration: 2500,
      });
    } finally {
      setIsLoading(false);
    }
    // setSubmitting(false);
    // navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4"
        >
          <Card className="glass-card w-full max-w-md lg:max-w-lg  mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-funnel">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium font-funnel"
                      >
                        Username
                      </label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="text"
                        className={`bg-background border-trading-primary font-funnel ${errors.email && touched.email ? "border-red-500" : ""
                          }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium font-funnel"
                      >
                        Password
                      </label>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        className={`bg-background border-trading-primary font-funnel ${errors.password && touched.password
                            ? "border-red-500"
                            : ""
                          }`}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-trading-primary hover:bg-trading-secondary font-funnel"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
