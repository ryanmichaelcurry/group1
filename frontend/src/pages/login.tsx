import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Checkbox,
    Anchor,
    Stack,
    CreateStyles,
    Rem,
    Select
} from '@mantine/core';
import Cookies from 'js-cookie';

export function AuthenticationForm(props: PaperProps) {
    
    const [type, toggle] = useToggle(['login', 'register']);
    const form = useForm({
        initialValues: {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            dateOfBirth: '2000 09 12',
            terms: true,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    return (
        <Paper radius="md" p="xl" withBorder {...props}>
            <Text size="lg" weight={500}>
                Welcome to Legal Paperweights!
            </Text>

          

            <Divider label="Login or Register Below" labelPosition="center" my="lg" />

            <form onSubmit={form.onSubmit((e) => {
                // this is after user hits register or login
                if (type == 'register') {
                    // perfrom backend registering items
                    // store success/failure into bool below. 

                    var success = true;

                    // put user data into the cookie. This allows their info to be accessed elsewhere
                    // I'm using sample data for testing purposes
                    var user = {
                        user_id: 1231,
                        first: 'Hutton',
                        last: 'Smith',
                        status: 'admin'
                    }
               
                    Cookies.set('loggedInUser', JSON.stringify(user));
                    
                }
                else if (type == 'login') {
                    //perform backend login verification
                    // store success into bool below

                    var success = true;

                    // put user data into the cookie. This allows their info to be accessed elsewhere
                    // I'm using sample data for testing purposes
                    var user = {
                        user_id: 1231,
                        first: 'Hutton',
                        last: 'Smith',
                        status: 'admin'
                    }

                    Cookies.set('loggedInUser', JSON.stringify(user));
                }
                

            })}>
                <Stack>
                    {type === 'register' && (
                        <TextInput
                            required
                            label="First Name"
                            placeholder="John"
                            value={form.values.firstName}
                            onChange={(event) => form.setFieldValue('firstName', event.currentTarget.value)}
                            radius="md"
                        />
                    )}

                    {type === 'register' && (
                        <TextInput
                            required
                            label="Last Name"
                            placeholder="Smith"
                            value={form.values.lastName}
                            onChange={(event) => form.setFieldValue('lastName', event.currentTarget.value)}
                            radius="md"
                        />
                    )}

                    <TextInput
                        required
                        label="Email"
                        placeholder="totallyLegal@gmail.com"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        radius="md"
                    />
                    {type === 'register' && (
                        <DatePickerInput
                            required
                            mt="md"
                            popoverProps={{ withinPortal: true }}
                            label="Date of Birth"
                            placeholder="YYYY MMM DD"
                            valueFormat="YYYY MMM DD"
                            defaultDate={new Date(2000, 1)}
                            onChange={(event) => form.setFieldValue('dateOfBirth', event.currentTarget)}

                        />
                    )}

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                        radius="md"
                    />

                    {type === 'register' && (
                        <Checkbox
                            
                            label="I accept terms and conditions"
                            checked={form.values.terms}
                            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        />
                    )}
                </Stack>

                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => toggle()}
                        size="xs"
                    >
                        {type === 'register'
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </Anchor>

                    <Button type="submit" radius="xl">
                        {upperFirst(type)}
                    </Button>
                </Group>
            </form>
        </Paper>
    );
}

export default AuthenticationForm;