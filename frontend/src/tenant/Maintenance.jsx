import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, TextareaAutosize } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createMaintenance, fetchMaintenance } from "../api/tenant";
import { Loader } from "../components/Loader";
import { FaDropbox } from "react-icons/fa6";
import dayjs from "dayjs";
import { toast } from "react-toastify";


export const Maintenance = () => {
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");
    const [selected, setSelected] = useState(null);
    const [cstatus, setStatus] = useState(false)

    const queryClient = useQueryClient();

    const {mutate} = useMutation({
        mutationFn: createMaintenance,
        onError: (error) => {
            console.log(error)
            toast.error( error.response ? error.response.data.message : error.message);    
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['tenant', 'maintenance']})
            toast.success('Succsess fully updated maintenance requests');
        }
    });

    const {data, status} = useQuery({
        queryKey: ['tenant', 'maintenance'],
        queryFn: fetchMaintenance
    });

    
    if (status === "pending")
        return <Loader />
        
    if (status === 'success')
    return <div className="max-w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 m-4">
        <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Maintenace Requests</h5>
            <button onClick={() => {setDescription(''); setSelected(null); setOpen(true); setStatus(false)}} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">New Request</button>
        </div>
    <div className="flow-root">
        {!data || data.length === 0?
            <div className="w-32 h-32 mx-auto dark:text-gray-300 text-gray-800">
                <FaDropbox className="w-full h-full" />
                <p className="text-center">No requests yet!</p>
            </div>
            :
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((request, idx) => 
                    <li key={idx} className="py-3 sm:py-4">
                        <div className="flex items-center">
                            <div className="flex items-center me-4">
                                <input checked={request.status} readOnly id="green-checkbox" type="checkbox" value="" className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                            </div>
                            <div onClick={() => {setDescription(request.description); setSelected(request._id); setStatus(request.status); setOpen(true)}} className="flex-1 min-w-0 ms-4 cursor-pointer">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {request.description}
                                </p>
                            </div>
                            <div className="inline-flex items-center ml-4 text-base font-semibold text-gray-900 dark:text-white h-full">
                                <div>
                                    <p className="text-xs mb-3 text-gray-500 truncate font-medium dark:text-gray-400">
                                        Issued at: {dayjs(request.createdAt).format("DD/MM/YYYY HH:mm A")}
                                    </p>
                                    <p className="text-xs mt-1 text-gray-500 truncate font-medium dark:text-gray-400">
                                        Updated at: {dayjs(request.updatedAt).format("DD/MM/YYYY HH:mm A")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                )
                }
            </ul>
        }
    </div>
    <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            mutate({description, _id: selected, status: cstatus});
            setOpen(false)
          },
        }}
      >
        <DialogTitle>{ selected?"Edit ":"Add new " }Maintenance Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write the description of your issue in the text area provided below 
          </DialogContentText>
          <TextareaAutosize
            autoFocus
            required
            minRows={3}
            value={description}
            readOnly={cstatus}
            onChange={(e) => setDescription(e.target.value)}
            id="name"
            name="email"
            placeholder="Description ...."
            className="w-full p-2 bg-gray-900 mt-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">{cstatus?"Delete":"Submit"}</Button>
          {cstatus&&<Button onClick={() => {
            mutate({_id: selected, status: cstatus, reopen:true});
            setOpen(false);
          }}>Reopen request</Button>}
        </DialogActions>
      </Dialog>
    </div>
}
